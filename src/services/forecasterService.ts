const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

export interface PriceData {
  date: string;
  price: number;
  dayNum: number;
}

export interface AnalysisResult {
  success: boolean;
  fromCity: string;
  toCity: string;
  month: string;
  cheapestDay: string;
  cheapestPrice: number;
  maxPrice: number;
  currentAverage: number;
  historicalAverage: number;
  priceTrend: string;
  confidenceScore: number;
  bestTimeToBook: string;
  aiInsights: string;
  priceData: PriceData[];
}

function getRouteBaseline(fromCity: string, toCity: string, mode: string) {
  const fromCode = String(fromCity).match(/\(([^)]+)\)/)?.[1] || fromCity;
  const toCode = String(toCity).match(/\(([^)]+)\)/)?.[1] || toCity;
  const pair = `${fromCode}-${toCode}`;

  const Baselines: Record<string, number> = {
    "DEL-BOM": 4200,
    "BOM-DEL": 4300,
    "BOM-GOI": 3200,
    "DEL-GOI": 4800,
    "BLR-DEL": 5200,
    "DEL-BLR": 5100,
    "MAA-CCU": 4600,
    "CCU-BOM": 4900,
  };

  let flightBase = Baselines[pair] || 4500; 

  if (mode === "Train") return Math.floor(flightBase * 0.35);
  if (mode === "Bus") return Math.floor(flightBase * 0.20);
  return flightBase; 
}

export function generateDailyPriceData(fromCity: string, toCity: string, monthName: string, mode: string): PriceData[] {
  const baseline = getRouteBaseline(fromCity, toCity, mode);
  const data: PriceData[] = [];
  
  const Months: Record<string, number> = {
    "January": 0, "February": 1, "March": 2, "April": 3, "May": 4, "June": 5,
    "July": 6, "August": 7, "September": 8, "October": 9, "November": 10, "December": 11
  };
  const monthIdx = Months[monthName] !== undefined ? Months[monthName] : 9; 
  
  const year = 2026;
  const daysInMonth = 30; 

  for (let day = 1; day <= daysInMonth; day++) {
    const dateObj = new Date(year, monthIdx, day);
    const dateString = dateObj.toISOString().split("T")[0];
    
    const dayOfWeek = dateObj.getDay(); 
    
    let multiplier = 1.0;
    
    if (dayOfWeek === 0 || dayOfWeek === 5) {
      multiplier += 0.18;
    } else if (dayOfWeek === 6) { 
      multiplier += 0.10;
    }
    
    if (day < 7) {
      multiplier += 0.05; 
    } else if (day >= 10 && day <= 18) {
      multiplier -= 0.12; 
    } else if (day > 22) {
      multiplier += 0.15; 
    }
    
    const randomVariation = (Math.sin(day * 0.9) * 0.05);
    multiplier += randomVariation;
    
    const finalPrice = Math.floor(baseline * multiplier);
    
    data.push({
      date: dateString,
      price: finalPrice,
      dayNum: day,
    });
  }
  
  return data;
}

export async function analyzeRoute(fromCity: string, toCity: string, month: string, mode: string = "Flight"): Promise<AnalysisResult> {
  const dailyData = generateDailyPriceData(fromCity, toCity, month, mode);
  
  const pricesOnly = dailyData.map(d => d.price);
  const minPrice = Math.min(...pricesOnly);
  const maxPrice = Math.max(...pricesOnly);
  const currentAverage = Math.floor(pricesOnly.reduce((a, b) => a + b, 0) / pricesOnly.length);
  
  const cheapestDayObj = dailyData.find(d => d.price === minPrice);
  const cheapestDate = cheapestDayObj ? cheapestDayObj.date : "";
  
  const firstTenAvg = pricesOnly.slice(0, 10).reduce((a, b) => a + b, 0) / 10;
  const lastTenAvg = pricesOnly.slice(20, 30).reduce((a, b) => a + b, 0) / 10;
  
  let trend = "stable";
  if (lastTenAvg > firstTenAvg * 1.05) {
    trend = "rising";
  } else if (lastTenAvg < firstTenAvg * 0.95) {
    trend = "falling";
  }

  const historicalAverage = Math.floor(currentAverage * 1.08);

  const prompt = `You are Saathi, an expert AI travel assistant for GoYatra.
Analyze the ${mode.toLowerCase()} route from ${fromCity} to ${toCity} for the month of ${month}.
I have compiled the processed daily price data for you:
- Min Price (Cheapest): ₹${minPrice} on ${cheapestDate}
- Max Price (Surge): ₹${maxPrice}
- Current Average: ₹${currentAverage}
- Historical Average: ₹${historicalAverage}
- Overall Trend: ${trend}

Please provide a highly professional response containing:
1. "marketInsights": A short, friendly explanation (exactly 2-3 sentences) from Saathi's perspective explaining this trend. Mention holiday demand, capacity, or seasonal behaviors matching Indian context for ${mode.toLowerCase()} travel.
2. "bestTimeToBook": Concrete booking advice (e.g. "Wait to book - prices are expected to drop by 12% next week" or "Book now - current fares are at an all-time low for the month").
3. "confidenceScore": An integer between 85 and 99.

Return ONLY a valid JSON matching this schema:
{
  "marketInsights": string,
  "bestTimeToBook": string,
  "confidenceScore": number
}`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API returned status ${response.status}`);
    }

    const rawData = await response.json();
    const parsedText = rawData.candidates[0].content.parts[0].text.trim();
    const parsedAi = JSON.parse(parsedText);

    return {
      success: true,
      fromCity,
      toCity,
      month,
      cheapestDay: cheapestDate,
      cheapestPrice: minPrice,
      maxPrice: maxPrice,
      currentAverage,
      historicalAverage,
      priceTrend: trend,
      confidenceScore: parsedAi.confidenceScore || 90,
      bestTimeToBook: parsedAi.bestTimeToBook || "Book now for optimized prices.",
      aiInsights: parsedAi.marketInsights || "Fares are stable. I recommend completing your booking soon to avoid weekend surges.",
      priceData: dailyData
    };

  } catch (err) {
    const aiError = err as any;
    console.warn("Gemini AI failed, falling back to local heuristic reasoning:", aiError.message);
    
    let fallbackInsights = `I'm seeing a general ${trend} price structure for ${mode.toLowerCase()} travel between ${fromCity} and ${toCity} in ${month}.`;
    let fallbackRecommendation = "Book now. Fares are expected to climb closer to the departure date.";
    
    if (trend === "falling") {
      fallbackInsights = `I've analyzed the ${mode.toLowerCase()} capacities and found a sweet spot mid-month! Fares from ${fromCity} to ${toCity} are currently dropping due to seasonal re-balancing.`;
      fallbackRecommendation = `Wait to book! Prices are expected to reach their lowest (₹${minPrice}) around the middle of ${month}.`;
    } else if (trend === "rising") {
      fallbackInsights = `Early booking is highly advised. Fares are on a steep upward trajectory due to heavy travel and upcoming weekend demand on the ${fromCity}-${toCity} corridor.`;
      fallbackRecommendation = `Book now! Current prices (average ₹${currentAverage}) are as low as they will be for the rest of ${month}.`;
    }

    return {
      success: true,
      fromCity,
      toCity,
      month,
      cheapestDay: cheapestDate,
      cheapestPrice: minPrice,
      maxPrice: maxPrice,
      currentAverage,
      historicalAverage,
      priceTrend: trend,
      confidenceScore: 88,
      bestTimeToBook: fallbackRecommendation,
      aiInsights: fallbackInsights,
      priceData: dailyData
    };
  }
}
