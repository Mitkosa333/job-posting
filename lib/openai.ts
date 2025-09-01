import OpenAI from 'openai'

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

/**
 * Check if OpenAI is properly configured
 */
export function isOpenAIConfigured(): boolean {
  return !!process.env.OPENAI_API_KEY
}

/**
 * Analyze candidate resume against job description using OpenAI
 * @param resume - Candidate's resume text
 * @param jobDescription - Job description text
 * @returns Promise<number> - Match percentage (0-100)
 */
export async function analyzeResumeMatch(
  resume: string, 
  jobDescription: string
): Promise<number> {
  if (!isOpenAIConfigured()) {
    throw new Error('OpenAI not configured - API key required for resume analysis')
  }

  console.log('Analyzing resume match with OpenAI...')
  
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: "system",
        content: `You are an expert recruiter and hiring manager. Your job is to analyze how well a candidate's resume matches a job description and return ONLY a percentage number between 0-100.

Consider these factors:
- Relevant work experience and skills
- Education and qualifications
- Years of experience in the field
- Technical skills match
- Soft skills alignment
- Industry experience
- Career progression relevance

Return ONLY the percentage number (e.g., "75") with no additional text, explanations, or formatting.`
      },
      {
        role: "user",
        content: `Job Description:
${jobDescription}

Candidate Resume:
${resume}

What percentage match is this candidate for this job? Return only the percentage number.`
      }
    ],
    max_tokens: 10,
    temperature: 0.3
  })
  
  const content = response.choices[0]?.message?.content?.trim()
  
  if (!content) {
    throw new Error('No response from OpenAI')
  }
  
  // Extract percentage from response
  const percentage = parseInt(content.replace(/[^0-9]/g, ''))
  
  if (isNaN(percentage) || percentage < 0 || percentage > 100) {
    throw new Error(`Invalid percentage from OpenAI: ${content}`)
  }
  
  console.log(`OpenAI analysis complete: ${percentage}%`)
  return percentage
}

/**
 * Calculate match percentages for a candidate against all jobs
 * @param candidateResume - Candidate's resume text
 * @param jobs - Array of job objects with id and description
 * @returns Promise<Array<{jobId: string, percentage: number}>>
 */
export async function calculateAllJobMatches(
  candidateResume: string,
  jobs: Array<{ _id: string; description: string }>
): Promise<Array<{ jobId: string; percentage: number }>> {
  console.log(`Calculating matches for candidate against ${jobs.length} jobs...`)
  
  const matches = []
  
  for (const job of jobs) {
    try {
      const percentage = await analyzeResumeMatch(candidateResume, job.description)
      matches.push({
        jobId: job._id,
        percentage: percentage
      })
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error calculating match for job ${job._id}:`, error)
      // Skip this job if OpenAI fails
      continue
    }
  }
  
  console.log(`Completed match calculations: ${matches.length} job matches`)
  return matches
}

/**
 * Calculate match percentages for a job against all candidates
 * @param jobDescription - Job description text
 * @param candidates - Array of candidate objects with id and resume
 * @returns Promise<Array<{candidateId: string, percentage: number}>>
 */
export async function calculateAllCandidateMatches(
  jobDescription: string,
  candidates: Array<{ _id: string; resume: string }>
): Promise<Array<{ candidateId: string; percentage: number }>> {
  console.log(`Calculating matches for job against ${candidates.length} candidates...`)
  
  const matches = []
  
  for (const candidate of candidates) {
    try {
      const percentage = await analyzeResumeMatch(candidate.resume, jobDescription)
      matches.push({
        candidateId: candidate._id,
        percentage: percentage
      })
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100))
    } catch (error) {
      console.error(`Error calculating match for candidate ${candidate._id}:`, error)
      // Skip this candidate if OpenAI fails
      continue
    }
  }
  
  console.log(`Completed match calculations: ${matches.length} candidate matches`)
  return matches
}
