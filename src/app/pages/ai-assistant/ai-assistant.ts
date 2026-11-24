AirQualityService
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AirQualityService } from '../../services/air-quality';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './ai-assistant.html',
  styleUrl: './ai-assistant.scss'
})
export class AiAssistant {

  private airQualityService = inject(AirQualityService);

  userMessage = '';
  isLoading = false;

  messages: ChatMessage[] = [
    {
      role: 'assistant',
      content: 'Hello! I am your WeatherBetter AI assistant. Ask me anything about air quality and protecting your family.'
    }
  ];

  suggestions = [
    'How can I improve indoor air quality?',
    'Is it safe to exercise outdoors today?',
    'How can I protect my children from pollution?'
  ];

  sendMessage(message?: string) {

    const question = (message || this.userMessage).trim();

    if (!question || this.isLoading) {
      return;
    }

    this.messages.push({
      role: 'user',
      content: question
    });

    this.userMessage = '';
    this.isLoading = true;

    this.airQualityService.sendMessage(question).subscribe({
      next: (response) => {
        this.messages.push({
          role: 'assistant',
          content: response.reply
        });

        this.isLoading = false;
      },

      error: (error) => {
        console.error('Chat API error:', error);

        this.messages.push({
          role: 'assistant',
          content: 'Sorry! I could not connect to the AI service right now. Please try again in a moment.'
        });

        this.isLoading = false;
      }
    });
  }
}
