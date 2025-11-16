# AI Chat Landing Page Documentation

## Overview
The landing page features a modern, Vercel-style AI chat interface that helps parents find the perfect tutor for their needs.

## Features

### 1. **AI-Powered Chat Interface**
- Uses Vercel AI SDK with OpenAI GPT-3.5-turbo
- Streaming responses for real-time interaction
- Context-aware recommendations based on available tutors

### 2. **Modern Design**
- Clean, minimalist Vercel-style aesthetic
- No emojis or unprofessional elements
- Smooth animations and transitions
- Professional SVG icons instead of emojis

### 3. **Chat Features**
- **Expandable Interface**: Chat expands when user interacts
- **Quick Suggestions**: Pre-filled prompts for common queries
- **Real-time Streaming**: Smooth, character-by-character AI responses
- **Loading States**: Professional loading indicators
- **Message History**: Full conversation context maintained

### 4. **Sidebar Navigation**
- Clean icon-based navigation
- Links to key sections:
  - 首頁 (Home)
  - 搜尋教師 (Search Teachers)
  - 科目分類 (Subject Categories)
  - 關於我們 (About Us)
- Auth buttons (Login/Register)

## Technical Implementation

### Components

#### `AiChat` Component
Location: `/components/landing/ai-chat.tsx`

**Features:**
- Uses `useChat` hook from Vercel AI SDK
- Auto-scrolls to latest message
- Expandable/collapsible interface
- Quick suggestion buttons
- Professional loading states

**Props:**
- None (fully self-contained)

**State:**
- `messages`: Chat message history
- `input`: Current user input
- `isLoading`: AI response loading state
- `isExpanded`: Chat panel visibility

#### `LandingContent` Component
Location: `/components/landing/landing-content.tsx`

**Features:**
- Sidebar navigation with SVG icons
- Hero section with AI chat
- Tutor grid display
- Modal tutor profiles

### API Route

#### `/api/chat` Endpoint
Location: `/app/api/chat/route.ts`

**Features:**
- Edge runtime for optimal performance
- Streams responses using OpenAI
- Fetches tutor context from Supabase
- Professional system prompt
- Error handling

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "我需要高中數學家教" }
  ]
}
```

**Response:**
- Streaming text response
- Context-aware recommendations
- Professional tone (no emojis)

## Setup Instructions

### 1. Environment Variables
Add to your `.env.local`:

```bash
# Required for AI Chat
OPENAI_API_KEY=sk-your-openai-api-key
```

### 2. OpenAI API Key
1. Visit https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to your `.env.local`

### 3. Dependencies
Already installed:
- `ai` - Vercel AI SDK
- `openai` - OpenAI Node.js SDK

## Design Principles

### 1. **Vercel Aesthetic**
- Clean, minimal design
- Monochromatic color scheme (blacks, grays, whites)
- Smooth transitions and animations
- Professional typography (Noto Sans TC)

### 2. **No AI Clichés**
- No robot emojis or artificial visual elements
- Professional SVG icons
- Clean, business-like appearance
- Subtle, sophisticated interactions

### 3. **Professional Tone**
- Formal yet friendly language
- No emojis in AI responses
- Clear, concise recommendations
- Focus on relevant information

## User Experience Flow

1. **Initial View**
   - Large search input with prompt
   - Quick suggestion buttons below
   - Tutor cards displayed

2. **User Interaction**
   - Click input or suggestion
   - Chat expands below input
   - AI responds with streaming text

3. **Conversation**
   - User messages in dark bubbles (right-aligned)
   - AI responses in light bubbles (left-aligned)
   - Smooth scrolling to new messages

4. **Finding Tutors**
   - AI recommends based on needs
   - User can browse tutor cards below
   - Click card to open modal with full profile

## Customization

### Changing AI Model
Edit `/app/api/chat/route.ts`:

```typescript
model: "gpt-4", // Instead of gpt-3.5-turbo
```

### Modifying System Prompt
Edit the `systemMessage` in `/app/api/chat/route.ts` to change AI behavior.

### Styling
All styles use Tailwind CSS classes. Main style locations:
- Chat interface: `/components/landing/ai-chat.tsx`
- Layout: `/components/landing/landing-content.tsx`

### Quick Suggestions
Modify in `/components/landing/ai-chat.tsx`:

```typescript
["我需要高中數學家教", "尋找線上英文老師", "國中物理補習", "程式設計入門"]
```

## Performance Considerations

1. **Edge Runtime**: API route runs on edge for low latency
2. **Streaming**: Responses stream in real-time
3. **Context Limiting**: Only fetches 20 tutors for context
4. **Auto-scroll**: Smooth, debounced scrolling

## Future Enhancements

Potential improvements:
- Voice input support
- Multi-language support
- Save conversation history
- Export chat transcript
- More advanced matching algorithms
- Tutor availability integration

## Troubleshooting

### Chat not responding
1. Check `OPENAI_API_KEY` is set in `.env.local`
2. Verify API key is valid
3. Check browser console for errors
4. Ensure Supabase connection is working

### Styling issues
1. Clear Next.js cache: `rm -rf .next`
2. Rebuild: `npm run build`
3. Check Tailwind configuration

### API errors
1. Check server logs
2. Verify edge runtime compatibility
3. Test OpenAI API key separately

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Screen reader friendly
- High contrast text
- Focus indicators on all interactive elements

