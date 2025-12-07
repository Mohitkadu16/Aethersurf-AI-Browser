import React from 'react';
import Button from './Button';

const ExamplePrompts = ({ onPromptClick }) => {
  const prompts = [
    {
      text: "How does quantum computing work?",
      icon: "⚛️"
    },
    {
      text: "Write a short story about a time traveler",
      icon: "⌛"
    },
    {
      text: "Explain artificial intelligence like I'm 10",
      icon: "🤖"
    },
    {
      text: "What are the best practices for web development?",
      icon: "💻"
    }
  ];

  return (
    <div className="w-full space-y-3 mt-4">
      <div className="text-sm text-text-secondary text-center">Try these examples:</div>
      <div className="flex flex-wrap gap-2 justify-center">
        {prompts.map((prompt, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onPromptClick(prompt.text)}
            className="bg-background hover:bg-muted/50 text-sm border border-gray-300 dark:border-gray-700"
          >
            <span className="mr-2">{prompt.icon}</span>
            {prompt.text}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ExamplePrompts;
