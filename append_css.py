with open('src/index.css', 'a') as f:
    f.write('''

/* ========================================= */
/* Chatbot Typing Animation                  */
/* ========================================= */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
''')
print("Appended bounce animation to index.css")
