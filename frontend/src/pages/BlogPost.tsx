// src/pages/BlogPost.tsx
import { motion } from "framer-motion";
import React from "react";
import { useNavigate, useParams } from "react-router";
import {
    PiArrowLeftBold,
    PiMagicWandDuotone,
    PiCalendarDuotone,
    PiClockDuotone,
    PiCheckCircleFill,
    PiWarningCircleBold,
    PiLightbulbDuotone
} from "react-icons/pi";
import { Button } from "../components/ui/Button";

interface BlogContent {
    title: string;
    date: string;
    readTime: string;
    content: React.ReactNode;
}

const blogContents: { [key: string]: BlogContent } = {
    "what-is-ats-resume-checker": {
        title: "What is an ATS and Why Does Your Resume Need to Pass It?",
        date: "December 22, 2025",
        readTime: "5 min read",
        content: (
            <>
                <p className="lead">
                    Did you know that <strong>75% of resumes are rejected by ATS systems</strong> before a human ever sees them?
                    Understanding how Applicant Tracking Systems work is crucial for your job search success.
                </p>

                <h2>What is an ATS (Applicant Tracking System)?</h2>
                <p>
                    An ATS is software used by companies to manage job applications. It scans resumes for keywords,
                    qualifications, and formatting to rank candidates. Major companies like Google, Amazon, and Microsoft
                    all use ATS to filter the thousands of applications they receive.
                </p>

                <h2>How Does an ATS Work?</h2>
                <p>When you submit your resume online, here's what happens:</p>
                <ol>
                    <li><strong>Parsing:</strong> The ATS extracts text from your resume</li>
                    <li><strong>Keyword Matching:</strong> It compares your resume against the job description</li>
                    <li><strong>Ranking:</strong> Candidates are scored based on match percentage</li>
                    <li><strong>Filtering:</strong> Only top-ranked resumes reach human recruiters</li>
                </ol>

                <h2>Why Most Resumes Fail ATS Scans</h2>
                <div className="warning-box">
                    <PiWarningCircleBold className="w-6 h-6 text-amber-500" />
                    <div>
                        <strong>Common ATS Killers:</strong>
                        <ul>
                            <li>Fancy formatting, tables, or graphics</li>
                            <li>Missing keywords from the job description</li>
                            <li>Non-standard section headers</li>
                            <li>Submitting in wrong file format</li>
                        </ul>
                    </div>
                </div>

                <h2>How to Make Your Resume ATS-Friendly</h2>
                <div className="tip-box">
                    <PiLightbulbDuotone className="w-6 h-6 text-primary" />
                    <div>
                        <strong>ATS Optimization Tips:</strong>
                        <ul>
                            <li>Use standard section headers (Experience, Education, Skills)</li>
                            <li>Include keywords from the job description naturally</li>
                            <li>Use simple formatting — avoid tables and graphics</li>
                            <li>Submit as PDF or DOCX (check job posting requirements)</li>
                            <li>Use a single-column layout</li>
                        </ul>
                    </div>
                </div>

                <h2>Check Your Resume with JobFit AI</h2>
                <p>
                    Our free AI-powered resume analyzer checks your resume against ATS requirements and the specific
                    job description you're applying to. Get instant feedback on keywords, formatting, and section scores.
                </p>
            </>
        )
    },
    "resume-keywords-2025": {
        title: "10 Resume Keywords That Will Get You Hired in 2025",
        date: "December 20, 2025",
        readTime: "4 min read",
        content: (
            <>
                <p className="lead">
                    The right keywords can make the difference between your resume landing in the "yes" pile or the trash.
                    Here are the <strong>power words that recruiters and ATS systems love</strong> in 2025.
                </p>

                <h2>Action Verbs That Stand Out</h2>
                <p>Replace weak verbs with these powerful alternatives:</p>
                <ul>
                    <li><strong>Achieved</strong> — Shows results and accomplishments</li>
                    <li><strong>Implemented</strong> — Demonstrates initiative</li>
                    <li><strong>Optimized</strong> — Shows efficiency focus</li>
                    <li><strong>Collaborated</strong> — Highlights teamwork</li>
                    <li><strong>Spearheaded</strong> — Indicates leadership</li>
                </ul>

                <h2>In-Demand Technical Skills</h2>
                <div className="tip-box">
                    <PiCheckCircleFill className="w-6 h-6 text-primary" />
                    <div>
                        <strong>Hot Skills for 2025:</strong>
                        <ul>
                            <li>Artificial Intelligence / Machine Learning</li>
                            <li>Cloud Computing (AWS, Azure, GCP)</li>
                            <li>Data Analysis & Visualization</li>
                            <li>Cybersecurity</li>
                            <li>Agile / Scrum Methodology</li>
                        </ul>
                    </div>
                </div>

                <h2>Soft Skills That Matter</h2>
                <p>Don't forget these universally valued traits:</p>
                <ul>
                    <li><strong>Problem-solving</strong> — Critical for any role</li>
                    <li><strong>Communication</strong> — Written and verbal</li>
                    <li><strong>Adaptability</strong> — Essential in fast-changing environments</li>
                    <li><strong>Leadership</strong> — Even for non-management roles</li>
                    <li><strong>Time Management</strong> — Shows reliability</li>
                </ul>

                <h2>How to Use Keywords Effectively</h2>
                <p>
                    Don't just stuff keywords randomly! Read the job description carefully and incorporate relevant
                    terms naturally throughout your resume. Use our free ATS checker to identify missing keywords
                    specific to the job you're applying for.
                </p>
            </>
        )
    },
    "resume-mistakes-to-avoid": {
        title: "Common Resume Mistakes That Get You Rejected Instantly",
        date: "December 18, 2025",
        readTime: "6 min read",
        content: (
            <>
                <p className="lead">
                    Your resume has <strong>6-7 seconds</strong> to make an impression. Don't waste it with these
                    common mistakes that lead to instant rejection.
                </p>

                <h2>Formatting Disasters</h2>
                <div className="warning-box">
                    <PiWarningCircleBold className="w-6 h-6 text-red-500" />
                    <div>
                        <strong>Avoid These Format Mistakes:</strong>
                        <ul>
                            <li>Using fancy fonts or colors</li>
                            <li>Inconsistent spacing and margins</li>
                            <li>Walls of text with no bullet points</li>
                            <li>More than 2 pages (unless 10+ years experience)</li>
                            <li>Including a photo (in US/UK markets)</li>
                        </ul>
                    </div>
                </div>

                <h2>Content Red Flags</h2>
                <ul>
                    <li><strong>Typos and grammatical errors</strong> — Instant rejection for 77% of hiring managers</li>
                    <li><strong>Generic objective statements</strong> — "Seeking a challenging position..." is outdated</li>
                    <li><strong>Listing duties instead of achievements</strong> — Focus on results, not responsibilities</li>
                    <li><strong>Including irrelevant experience</strong> — Tailor your resume for each job</li>
                </ul>

                <h2>ATS-Specific Mistakes</h2>
                <ul>
                    <li>Using headers/footers for contact info (ATS can't read them)</li>
                    <li>Putting information in text boxes or tables</li>
                    <li>Using acronyms without spelling them out first</li>
                    <li>Saving as an image or incompatible format</li>
                </ul>

                <h2>The Fix</h2>
                <div className="tip-box">
                    <PiLightbulbDuotone className="w-6 h-6 text-primary" />
                    <div>
                        <strong>Quick Fixes:</strong>
                        <ul>
                            <li>Proofread at least 3 times (or use Grammarly)</li>
                            <li>Quantify achievements with numbers</li>
                            <li>Use bullet points (3-5 per job)</li>
                            <li>Run through an ATS checker before submitting</li>
                        </ul>
                    </div>
                </div>

                <p>
                    Want to know if your resume has any of these issues? Use our free AI analyzer to get
                    instant feedback and fix problems before you apply.
                </p>
            </>
        )
    },
    "how-jobfit-ai-works": {
        title: "How JobFit AI Works: Your Free AI Resume Analyzer Explained",
        date: "December 22, 2025",
        readTime: "4 min read",
        content: (
            <>
                <p className="lead">
                    JobFit AI is a <strong>100% free AI-powered resume analyzer</strong> that helps you optimize
                    your resume for any job application. Here's exactly how it works and why it can help you
                    land more interviews.
                </p>

                <h2>Step 1: Upload Your Resume</h2>
                <p>
                    Simply drag and drop your resume file (PDF, DOC, or DOCX) onto our upload area.
                    Your file is processed securely and <strong>never stored on our servers</strong>.
                    We respect your privacy — your data is analyzed and immediately discarded.
                </p>
                <div className="tip-box">
                    <PiCheckCircleFill className="w-6 h-6 text-primary" />
                    <div>
                        <strong>Supported Formats:</strong>
                        <ul>
                            <li>PDF (recommended)</li>
                            <li>Microsoft Word (.doc, .docx)</li>
                            <li>Maximum file size: 5MB</li>
                        </ul>
                    </div>
                </div>

                <h2>Step 2: Paste the Job Description</h2>
                <p>
                    Copy and paste the job description you're applying for. This is crucial because
                    our AI compares your resume <strong>directly against the specific job requirements</strong>.
                    The more detailed the job description, the better our analysis.
                </p>

                <h2>Step 3: AI-Powered Analysis</h2>
                <p>
                    Once you click "Analyze My Resume," our advanced AI engine goes to work:
                </p>
                <ol>
                    <li><strong>Resume Parsing:</strong> We extract all text and structure from your resume</li>
                    <li><strong>Section Identification:</strong> We identify Experience, Education, Skills, and other sections</li>
                    <li><strong>Keyword Matching:</strong> We compare your content against the job description</li>
                    <li><strong>Scoring:</strong> Each section receives a score out of 10</li>
                    <li><strong>Recommendations:</strong> We generate specific improvement suggestions</li>
                </ol>

                <h2>What You Get: The Results</h2>
                <div className="tip-box">
                    <PiLightbulbDuotone className="w-6 h-6 text-primary" />
                    <div>
                        <strong>Your Analysis Includes:</strong>
                        <ul>
                            <li><strong>Job Match Score:</strong> Overall percentage match with the job</li>
                            <li><strong>Section Scores:</strong> Individual scores for Experience, Skills, Education, etc.</li>
                            <li><strong>Missing Keywords:</strong> Important terms from the job description you should add</li>
                            <li><strong>Improvement Suggestions:</strong> Specific tips to strengthen each section</li>
                            <li><strong>ATS Compatibility:</strong> Whether your resume format is ATS-friendly</li>
                        </ul>
                    </div>
                </div>

                <h2>Why Use JobFit AI?</h2>
                <ul>
                    <li><strong>100% Free:</strong> No hidden costs, no premium tiers, no credit card required</li>
                    <li><strong>Instant Results:</strong> Get your analysis in under 30 seconds</li>
                    <li><strong>Privacy First:</strong> We don't store your resume or personal data</li>
                    <li><strong>AI-Powered:</strong> Uses advanced language models for accurate analysis</li>
                    <li><strong>Job-Specific:</strong> Tailored recommendations based on the actual job you're applying for</li>
                </ul>

                <h2>Pro Tips for Best Results</h2>
                <div className="warning-box">
                    <PiWarningCircleBold className="w-6 h-6 text-amber-500" />
                    <div>
                        <strong>Maximize Your Analysis:</strong>
                        <ul>
                            <li>Use a clean, simple resume format (no tables or graphics)</li>
                            <li>Paste the complete job description, not just the title</li>
                            <li>Run the analysis for each job you apply to — every job is different!</li>
                            <li>Implement the suggestions and re-analyze to see improvement</li>
                        </ul>
                    </div>
                </div>

                <h2>Ready to Optimize Your Resume?</h2>
                <p>
                    Join thousands of job seekers who have improved their resumes with JobFit AI.
                    It takes less than a minute to get actionable insights that can make the difference
                    between getting an interview and getting ignored.
                </p>
            </>
        )
    }
};

const BlogPost: React.FC = () => {
    const navigate = useNavigate();
    const { slug } = useParams<{ slug: string }>();

    const post = slug ? blogContents[slug] : null;

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">Post Not Found</h1>
                    <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-white">
            {/* Background */}
            <div className="fixed inset-0 overflow-hidden -z-10 bg-[#fafafa]">
                <div className="bg-blur-blob w-[500px] h-[500px] bg-blue-100/40 -top-20 -left-20" />
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b border-gray-100">
                <div className="max-w-3xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/blog")}
                            className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
                        >
                            <PiArrowLeftBold className="w-5 h-5 text-slate-700" />
                        </button>
                        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/dashboard")}>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <PiMagicWandDuotone className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-slate-900">JobFit AI</span>
                        </div>
                    </div>
                    <Button size="sm" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary-dark">
                        Try Free Analyzer
                    </Button>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto px-6 py-16">
                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="prose prose-lg prose-slate max-w-none"
                >
                    {/* Header */}
                    <header className="mb-12 not-prose">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                            {post.title}
                        </h1>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1.5">
                                <PiCalendarDuotone className="w-4 h-4" />
                                {post.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <PiClockDuotone className="w-4 h-4" />
                                {post.readTime}
                            </span>
                        </div>
                    </header>

                    {/* Content */}
                    <div className="blog-content">
                        {post.content}
                    </div>

                    {/* CTA */}
                    <div className="not-prose mt-12 text-center bg-gradient-to-r from-primary/5 to-blue-50 rounded-3xl p-10 border border-primary/10">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4">
                            Check Your Resume Now — It's Free!
                        </h3>
                        <p className="text-slate-500 mb-6">
                            Upload your resume and get instant AI-powered feedback on ATS compatibility and improvements.
                        </p>
                        <Button size="xl" onClick={() => navigate("/dashboard")} className="bg-primary hover:bg-primary-dark">
                            Analyze My Resume
                        </Button>
                    </div>
                </motion.article>
            </main>

            {/* Footer */}
            <footer className="border-t border-gray-100 bg-slate-50/50 py-8 px-6">
                <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <PiMagicWandDuotone className="text-primary w-5 h-5" />
                        <span className="text-lg font-bold text-slate-900">JobFit AI</span>
                    </div>
                    <p className="text-xs text-slate-400">© 2025 JobFit AI. All rights reserved.</p>
                </div>
            </footer>

            {/* Blog Styles */}
            <style>{`
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .blog-content p {
          color: #64748b;
          line-height: 1.8;
          margin-bottom: 1rem;
        }
        .blog-content p.lead {
          font-size: 1.25rem;
          color: #475569;
        }
        .blog-content ul, .blog-content ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
          color: #64748b;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .blog-content strong {
          color: #1e293b;
        }
        .warning-box, .tip-box {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          border-radius: 1rem;
          margin: 1.5rem 0;
        }
        .warning-box {
          background: #fef3c7;
          border: 1px solid #fcd34d;
        }
        .tip-box {
          background: rgba(0, 192, 145, 0.1);
          border: 1px solid rgba(0, 192, 145, 0.3);
        }
        .warning-box ul, .tip-box ul {
          margin: 0.5rem 0 0 0;
        }
      `}</style>
        </div>
    );
};

export default BlogPost;
