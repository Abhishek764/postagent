import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateLinkedInPost({ story, dayNumber, postType, githubData, leetcodeData }) {
  const systemInstruction = `You are an expert LinkedIn ghostwriter for developers. You specialize in authentic human storytelling that gets real engagement — not corporate fluff. You write for a full-stack developer doing a "Code Every Day Until I Get a Job" series called #CodeTillIGetHired.

Your posts must follow these rules:
- First 1-2 lines must be a scroll-stopping hook before LinkedIn's "...see more" cutoff. Personal, specific, or surprising — never generic.
- Written in first person. Sound like a real person, not a brand.
- Reference specific technical details from GitHub and LeetCode data: actual commit messages, repo names, problem names, difficulty levels. If no data is available, write from the story alone.
- Weave the user's story naturally — their emotion, struggle, or win must come through.
- Short paragraphs. Generous line breaks. LinkedIn rewards white space.
- End with one engaging question or CTA to drive comments.
- Maximum 3 emojis total.
- End with hashtags: #CodeTillIGetHired #OpenToWork #FullStackDeveloper plus 2-3 more relevant ones.
- Total length: 180-260 words.
- Output ONLY the post text. No titles, no explanations, no markdown, no surrounding quotes.`

  // Build user message dynamically
  const messageParts = []
  messageParts.push(`Day ${dayNumber} of my #CodeTillIGetHired series.`)
  messageParts.push(`Post focus: ${postType}`)
  messageParts.push(`My story today: ${story}`)

  if (githubData && githubData.summary) {
    messageParts.push(`\nMy GitHub activity:\n${githubData.summary}`)
  }

  if (leetcodeData && leetcodeData.summary) {
    messageParts.push(`\nMy LeetCode activity:\n${leetcodeData.summary}`)
  }

  messageParts.push('\nWrite my LinkedIn post.')

  const userMessage = messageParts.join('\n')

  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    systemInstruction
  })

  const result = await model.generateContent(userMessage)
  return result.response.text()
}
