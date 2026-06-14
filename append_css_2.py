with open('src/index.css', 'a') as f:
    f.write('''

/* ========================================= */
/* Chatbot Custom Scrollbar & Markdown       */
/* ========================================= */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 0.75rem;
}
.markdown-body p:last-child {
  margin-bottom: 0;
}
.markdown-body ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.markdown-body strong {
  color: #ff5a00;
  font-weight: 600;
}
.markdown-body h1, .markdown-body h2, .markdown-body h3 {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}
''')
print("Appended markdown/scrollbar CSS to index.css")
