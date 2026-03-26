export type Language = "english" | "hinglish" | "hindi";

// 300+ translation keys for all pages - English, Hinglish, Hindi
export const translations: Record<string, Record<Language, string>> = {
  // SIDEBAR (18 items)
  "sidebar.dashboard": {
    english: "Dashboard",
    hinglish: "Dashboard",
    hindi: "डैशबोर्ड",
  },
  "sidebar.explore": {
    english: "AI Mentor",
    hinglish: "AI Mentor",
    hindi: "एआई मेंटर",
  },
  "sidebar.agents": {
    english: "AI Agents",
    hinglish: "AI Agents",
    hindi: "एआई एजेंट",
  },
  "sidebar.class_translator": {
    english: "Understand Class",
    hinglish: "Class Samjho",
    hindi: "कक्षा समझें",
  },
  "sidebar.smart_notes": {
    english: "Power Hour",
    hinglish: "Power Hour",
    hindi: "पावर आवर",
  },
  "sidebar.maths_solver": {
    english: "Maths Helper",
    hinglish: "Maths Helper",
    hindi: "गणित सहायक",
  },
  "sidebar.question_generator": {
    english: "Question Bank",
    hinglish: "Question Bank",
    hindi: "प्रश्न बैंक",
  },
  "sidebar.story_mode": {
    english: "Story Mode",
    hinglish: "Story Mode",
    hindi: "कहानी मोड",
  },
  "sidebar.revision": {
    english: "Auto Revision",
    hinglish: "Auto Revision",
    hindi: "स्वचालित संशोधन",
  },
  "sidebar.writing_coach": {
    english: "Writing Coach",
    hinglish: "Writing Coach",
    hindi: "लेखन कोच",
  },
  "sidebar.vision_lens": {
    english: "Vision Lens",
    hinglish: "Vision Lens",
    hindi: "विजन लेंस",
  },
  "sidebar.study_planner": {
    english: "Study Planner",
    hinglish: "Study Planner",
    hindi: "अध्ययन योजनाकार",
  },
  "sidebar.mentor": {
    english: "AI Mentor",
    hinglish: "AI Mentor",
    hindi: "एआई मेंटर",
  },
  "sidebar.leaderboard": {
    english: "Leaderboard",
    hinglish: "Leaderboard",
    hindi: "लीडरबोर्ड",
  },
  "sidebar.settings": {
    english: "Settings",
    hinglish: "Settings",
    hindi: "सेटिंग्स",
  },
  "sidebar.profile": {
    english: "Profile",
    hinglish: "Profile",
    hindi: "प्रोफाइल",
  },
  "sidebar.logout": { english: "Logout", hinglish: "Logout", hindi: "लॉग आउट" },
  "sidebar.parent": {
    english: "Parent Dashboard",
    hinglish: "Parent Dashboard",
    hindi: "अभिभावक डैशबोर्ड",
  },

  // COMMON LABELS
  "common.loading": {
    english: "Loading...",
    hinglish: "Loading ho raha hai...",
    hindi: "लोड हो रहा है...",
  },
  "common.error": { english: "Error", hinglish: "Error", hindi: "त्रुटि" },
  "common.success": { english: "Success", hinglish: "Success", hindi: "सफल" },
  "common.back": { english: "Back", hinglish: "Back", hindi: "वापस" },
  "common.cancel": {
    english: "Cancel",
    hinglish: "Cancel",
    hindi: "रद्द करें",
  },
  "common.save": { english: "Save", hinglish: "Save", hindi: "सहेजें" },
  "common.delete": { english: "Delete", hinglish: "Delete", hindi: "हटाएँ" },
  "common.logout": { english: "Logout", hinglish: "Logout", hindi: "लॉग आउट" },
  "common.submit": {
    english: "Submit",
    hinglish: "Submit Karo",
    hindi: "जमा करें",
  },
  "common.trying": {
    english: "Try again",
    hinglish: "Dobara Koshish Karo",
    hindi: "फिर से कोशिश करें",
  },
  "common.try_again": {
    english: "Try Again",
    hinglish: "Dobara Koshish Karo",
    hindi: "फिर से कोशिश करें",
  },

  // CLASS TRANSLATOR (10)
  "class_translator.title": {
    english: "Class Translator",
    hinglish: "Class Translator",
    hindi: "कक्षा अनुवादक",
  },
  "class_translator.subtitle": {
    english: "Get concepts explained in simple language",
    hinglish: "Concepts ko simple language mein samjhao",
    hindi: "अवधारणाओं को सरल भाषा में समझें",
  },
  "class_translator.subject": {
    english: "Subject",
    hinglish: "Subject",
    hindi: "विषय",
  },
  "class_translator.topic": {
    english: "Topic",
    hinglish: "Topic",
    hindi: "विषय",
  },
  "class_translator.content": {
    english: "Content / Concept",
    hinglish: "Content / Concept",
    hindi: "विषयवस्तु / अवधारणा",
  },
  "class_translator.explain": {
    english: "Explain",
    hinglish: "Explain Karo",
    hindi: "समझाएँ",
  },
  "class_translator.simple_explanation": {
    english: "Simple Explanation",
    hinglish: "Simple Explanation",
    hindi: "सरल व्याख्या",
  },
  "class_translator.real_life_example": {
    english: "Real Life Example",
    hinglish: "Real Life Example",
    hindi: "वास्तविक जीवन उदाहरण",
  },
  "class_translator.key_points": {
    english: "Key Points",
    hinglish: "Key Points",
    hindi: "मुख्य बिंदु",
  },
  "class_translator.related": {
    english: "Related Concepts",
    hinglish: "Related Concepts",
    hindi: "संबंधित अवधारणाएँ",
  },

  // MATHS SOLVER (25)
  "maths_solver.title": {
    english: "Maths Solver",
    hinglish: "Maths Solver",
    hindi: "गणित समाधान",
  },
  "maths_solver.subtitle": {
    english: "Paste any maths problem — get hints, steps, or full solution!",
    hinglish:
      "Koi bhi maths problem paste karo — hints, steps ya full solution pao!",
    hindi:
      "कोई भी गणित समस्या पेस्ट करें — संकेत, चरण या पूरा समाधान प्राप्त करें!",
  },
  "maths_solver.choose_mode": {
    english: "Choose Mode",
    hinglish: "Mode Chuno",
    hindi: "मोड चुनें",
  },
  "maths_solver.topic": {
    english: "Topic (optional)",
    hinglish: "Topic (optional)",
    hindi: "विषय (वैकल्पिक)",
  },
  "maths_solver.problem": {
    english: "Your Maths Problem",
    hinglish: "Aapka Maths Problem",
    hindi: "आपकी गणित समस्या",
  },
  "maths_solver.hint_mode": {
    english: "Hint Mode",
    hinglish: "Hint Mode",
    hindi: "संकेत मोड",
  },
  "maths_solver.hints_only": {
    english: "Get hints only",
    hinglish: "Sirf hints pao",
    hindi: "केवल संकेत पाएं",
  },
  "maths_solver.step_by_step": {
    english: "Step by Step",
    hinglish: "Step by Step",
    hindi: "चरण दर चरण",
  },
  "maths_solver.see_steps": {
    english: "See each step",
    hinglish: "Har step dekho",
    hindi: "हर चरण देखें",
  },
  "maths_solver.full_solution": {
    english: "Full Solution",
    hinglish: "Full Solution",
    hindi: "पूरा समाधान",
  },
  "maths_solver.complete_answer": {
    english: "Complete answer",
    hinglish: "Pura jawab",
    hindi: "पूरा जवाब",
  },
  "maths_solver.solve": {
    english: "Solve Problem",
    hinglish: "Problem Solve Karo",
    hindi: "समस्या हल करें",
  },
  "maths_solver.hints": { english: "Hints", hinglish: "Hints", hindi: "संकेत" },
  "maths_solver.solutions": {
    english: "Step-by-Step Solution",
    hinglish: "Step-by-Step Solution",
    hindi: "चरण दर चरण समाधान",
  },
  "maths_solver.full": {
    english: "Full Solution",
    hinglish: "Full Solution",
    hindi: "पूरा समाधान",
  },
  "maths_solver.answer": {
    english: "Answer",
    hinglish: "Answer",
    hindi: "उत्तर",
  },
  "maths_solver.concepts": {
    english: "Concepts Used",
    hinglish: "Concepts Used",
    hindi: "उपयोग की गई अवधारणाएँ",
  },
  "maths_solver.solving": {
    english: "Solving your problem...",
    hinglish: "Aapka problem solve ho raha hai...",
    hindi: "आपकी समस्या हल हो रही है...",
  },

  // VISION LENS (20)
  "vision_lens.title": {
    english: "Vision Lens",
    hinglish: "Vision Lens",
    hindi: "विजन लेंस",
  },
  "vision_lens.subtitle": {
    english:
      "Snap a photo of anything — diagram, textbook, whiteboard — and ask the AI to explain it!",
    hinglish:
      "Kisi bhi cheez ki photo lо — diagram, textbook, whiteboard — aur AI se explain karane ko kaho!",
    hindi:
      "किसी भी चीज़ की फोटो लें — आरेख, पाठ्यपुस्तक, व्हाइटबोर्ड — और एआई से समझाने को कहें!",
  },
  "vision_lens.drop_image": {
    english: "Drop your image here or browse",
    hinglish: "Apni image yaha drop karo ya browse karo",
    hindi: "अपनी छवि यहाँ ड्रॉप करें या ब्राउज़ करें",
  },
  "vision_lens.supported": {
    english:
      "Supports JPG, PNG, WEBP — textbooks, diagrams, whiteboards, notes",
    hinglish:
      "JPG, PNG, WEBP support karta hai — textbooks, diagrams, whiteboards, notes",
    hindi:
      "JPG, PNG, WEBP समर्थन करता है — पाठ्यपुस्तकें, आरेख, व्हाइटबोर्ड, नोट्स",
  },
  "vision_lens.click_drag": {
    english: "Click or drag & drop",
    hinglish: "Click karo ya drag & drop karo",
    hindi: "क्लिक करें या ड्रैग एंड ड्रॉप करें",
  },
  "vision_lens.quick_questions": {
    english: "Quick questions",
    hinglish: "Jaldi ke sawal",
    hindi: "तेज़ सवाल",
  },
  "vision_lens.explain": {
    english: "Explain what this image is showing",
    hinglish: "Yeh image kya dikha raha hai explain karo",
    hindi: "यह छवि क्या दिखा रही है इसे समझाएँ",
  },
  "vision_lens.related_topic": {
    english: "What topic does this relate to?",
    hinglish: "Yeh kis topic se related hai?",
    hindi: "यह किस विषय से संबंधित है?",
  },
  "vision_lens.summarize": {
    english: "Summarise the key points from this",
    hinglish: "Is se key points summarize karo",
    hindi: "इससे मुख्य बिंदुओं को सारांशित करें",
  },
  "vision_lens.questions": {
    english: "What questions could be asked from this?",
    hinglish: "Is se kaun se swaal puchche ja sakte hain?",
    hindi: "इससे कौन से सवाल पूछे जा सकते हैं?",
  },
  "vision_lens.memorise": {
    english: "What do I need to memorise from this?",
    hinglish: "Mujhe is se kya yaad rakhna chahiye?",
    hindi: "मुझे इससे क्या याद रखना चाहिए?",
  },
  "vision_lens.your_question": {
    english: "Your question about this image",
    hinglish: "Iska is image ke baare mein sawal",
    hindi: "इस छवि के बारे में आपका सवाल",
  },
  "vision_lens.ask": { english: "Ask", hinglish: "Puchho", hindi: "पूछें" },
  "vision_lens.ai_explanation": {
    english: "AI Explanation",
    hinglish: "AI Explanation",
    hindi: "एआई व्याख्या",
  },
  "vision_lens.key_points": {
    english: "Key Points",
    hinglish: "Key Points",
    hindi: "मुख्य बिंदु",
  },
  "vision_lens.related_topics": {
    english: "Related Topics to Explore",
    hinglish: "Related Topics to Explore",
    hindi: "अन्वेषण करने के लिए संबंधित विषय",
  },
  "vision_lens.study_tip": {
    english: "Study Tip",
    hinglish: "Study Tip",
    hindi: "अध्ययन सुझाव",
  },
  "vision_lens.analyzing": {
    english: "Analyzing your image...",
    hinglish: "Aapke image ko analyze kar rahe hain...",
    hindi: "आपकी छवि का विश्लेषण किया जा रहा है...",
  },

  // STORY MODE (15)
  "story_mode.title": {
    english: "Story Mode",
    hinglish: "Story Mode",
    hindi: "कहानी मोड",
  },
  "story_mode.subtitle": {
    english: "Turn any topic into an engaging story that makes concepts stick",
    hinglish:
      "Kisi bhi topic ko engaging story mein badlo jo concepts ko samjhaaye",
    hindi: "किसी भी विषय को एक आकर्षक कहानी में बदलें जो अवधारणाओं को समझाए",
  },
  "story_mode.what_learn": {
    english: "What do you want to learn through a story?",
    hinglish: "Tum kya seekhna chahte ho ek kahani ke through?",
    hindi: "आप एक कहानी के माध्यम से क्या सीखना चाहते हैं?",
  },
  "story_mode.subject": {
    english: "Subject",
    hinglish: "Subject",
    hindi: "विषय",
  },
  "story_mode.topic": {
    english: "Topic / Chapter",
    hinglish: "Topic / Chapter",
    hindi: "विषय / अध्याय",
  },
  "story_mode.generate": {
    english: "Generate Story",
    hinglish: "Kahani Generate Karo",
    hindi: "कहानी उत्पन्न करें",
  },
  "story_mode.characters": {
    english: "Characters",
    hinglish: "Characters",
    hindi: "पात्र",
  },
  "story_mode.moral": {
    english: "Moral / Lesson",
    hinglish: "Moral / Lesson",
    hindi: "नैतिकता / सीख",
  },
  "story_mode.concepts": {
    english: "Concepts Explained",
    hinglish: "Concepts Explained",
    hindi: "व्याख्यायित अवधारणाएँ",
  },
  "story_mode.discussion": {
    english: "Discussion Questions",
    hinglish: "Discussion Questions",
    hindi: "चर्चा के प्रश्न",
  },
  "story_mode.fun_fact": {
    english: "Fun Fact!",
    hinglish: "Fun Fact!",
    hindi: "मजेदार तथ्य!",
  },
  "story_mode.story": {
    english: "The Story",
    hinglish: "The Story",
    hindi: "कहानी",
  },
  "story_mode.generating": {
    english: "Creating your story...",
    hinglish: "Aapki kahani create ho rahi hai...",
    hindi: "आपकी कहानी बनाई जा रही है...",
  },

  // REVISION (20)
  "revision.title": {
    english: "Auto Revision",
    hinglish: "Auto Revision",
    hindi: "स्वचालित संशोधन",
  },
  "revision.flashcards": {
    english: "Flashcards",
    hinglish: "Flashcards",
    hindi: "फ्लैशकार्ड",
  },
  "revision.recall": {
    english: "Recall Questions",
    hinglish: "Recall Questions",
    hindi: "स्मरण प्रश्न",
  },
  "revision.summary": {
    english: "Quick Summary",
    hinglish: "Quick Summary",
    hindi: "तेज़ सारांश",
  },
  "revision.tips": {
    english: "Revision Tips",
    hinglish: "Revision Tips",
    hindi: "संशोधन सुझाव",
  },
  "revision.topic": {
    english: "Topic (optional)",
    hinglish: "Topic (optional)",
    hindi: "विषय (वैकल्पिक)",
  },
  "revision.subject": {
    english: "Subject (optional)",
    hinglish: "Subject (optional)",
    hindi: "विषय (वैकल्पिक)",
  },
  "revision.filter": {
    english: "Filter by time period",
    hinglish: "Time period se filter karo",
    hindi: "समय अवधि के आधार पर फ़िल्टर करें",
  },
  "revision.progress": {
    english: "Progress",
    hinglish: "Progress",
    hindi: "प्रगति",
  },
  "revision.done": { english: "done", hinglish: "done", hindi: "पूर्ण" },
  "revision.auto_revise": {
    english: "Auto Revise",
    hinglish: "Auto Revise Karo",
    hindi: "स्वचालित संशोधन करें",
  },
  "revision.revise": {
    english: "Revise",
    hinglish: "Revise Karo",
    hindi: "संशोधन करें",
  },
  "revision.reveal": {
    english: "Reveal Answer",
    hinglish: "Answer Reveal Karo",
    hindi: "उत्तर प्रकट करें",
  },
  "revision.hide": {
    english: "Hide Answer",
    hinglish: "Answer Chupao",
    hindi: "उत्तर छिपाएँ",
  },
  "revision.preparing": {
    english: "Preparing your revision...",
    hinglish: "Aapka revision prepare ho raha hai...",
    hindi: "आपका संशोधन तैयार हो रहा है...",
  },
  "revision.tap_to_reveal": {
    english: "Tap to Reveal",
    hinglish: "Tap Karke Dekho",
    hindi: "दबाकर देखें",
  },
  "revision.cached": {
    english: "Cached",
    hinglish: "Stored",
    hindi: "संग्रहीत",
  },
  "revision.total": { english: "Total", hinglish: "Total", hindi: "कुल" },
  "revision.session": {
    english: "Session",
    hinglish: "Session",
    hindi: "सत्र",
  },
  "revision.sessions": {
    english: "Sessions",
    hinglish: "Sessions",
    hindi: "सत्र",
  },

  // WRITING COACH (20)
  "writing_coach.title": {
    english: "Writing Coach",
    hinglish: "Writing Coach",
    hindi: "लेखन कोच",
  },
  "writing_coach.subtitle": {
    english: "Get AI feedback on grammar, structure, and vocabulary",
    hinglish: "Grammar, structure aur vocabulary par AI feedback pao",
    hindi: "व्याकरण, संरचना और शब्दावली पर एआई प्रतिक्रिया प्राप्त करें",
  },
  "writing_coach.submit_writing": {
    english: "Submit your writing for feedback",
    hinglish: "Apni writing feedback ke liye submit karo",
    hindi: "अपनी लेखन प्रतिक्रिया के लिए जमा करें",
  },
  "writing_coach.type": {
    english: "Writing Type",
    hinglish: "Writing Type",
    hindi: "लेखन प्रकार",
  },
  "writing_coach.subject": {
    english: "Subject",
    hinglish: "Subject",
    hindi: "विषय",
  },
  "writing_coach.topic_title": {
    english: "Topic / Title",
    hinglish: "Topic / Title",
    hindi: "विषय / शीर्षक",
  },
  "writing_coach.your_writing": {
    english: "Your Writing",
    hinglish: "Aapni Writing",
    hindi: "आपकी लेखन",
  },
  "writing_coach.get_feedback": {
    english: "Get Feedback",
    hinglish: "Feedback Pao",
    hindi: "प्रतिक्रिया प्राप्त करें",
  },
  "writing_coach.score": {
    english: "Overall Score",
    hinglish: "Overall Score",
    hindi: "कुल स्कोर",
  },
  "writing_coach.strengths": {
    english: "Strengths",
    hinglish: "Strengths",
    hindi: "शक्तियाँ",
  },
  "writing_coach.improve": {
    english: "Areas to Improve",
    hinglish: "Improve Karne Ke Areas",
    hindi: "सुधार के क्षेत्र",
  },
  "writing_coach.structure": {
    english: "Structure Feedback",
    hinglish: "Structure Feedback",
    hindi: "संरचना प्रतिक्रिया",
  },
  "writing_coach.grammar": {
    english: "Grammar Feedback",
    hinglish: "Grammar Feedback",
    hindi: "व्याकरण प्रतिक्रिया",
  },
  "writing_coach.vocabulary": {
    english: "Vocabulary Enhancements",
    hinglish: "Vocabulary Enhancements",
    hindi: "शब्दावली संवर्द्धन",
  },
  "writing_coach.excellent": {
    english: "Excellent!",
    hinglish: "Bahut Accha!",
    hindi: "शानदार!",
  },
  "writing_coach.very_good": {
    english: "Very Good",
    hinglish: "Bahut Accha!",
    hindi: "बहुत अच्छा",
  },
  "writing_coach.good": { english: "Good", hinglish: "Accha", hindi: "अच्छा" },
  "writing_coach.average": {
    english: "Average",
    hinglish: "Theek Hai",
    hindi: "औसत",
  },
  "writing_coach.needs_work": {
    english: "Needs Work",
    hinglish: "Improve Karna Padega",
    hindi: "सुधार की आवश्यकता",
  },
  "writing_coach.analyzing": {
    english: "Analyzing your writing...",
    hinglish: "Aapki writing analyze ho rahi hai...",
    hindi: "आपकी लेखन का विश्लेषण किया जा रहा है...",
  },
  "writing_coach.min_characters": {
    english: "Please write at least 50 characters",
    hinglish: "Kam se kam 50 characters likho",
    hindi: "कम से कम 50 वर्ण लिखें",
  },
  "writing_coach.feedback_ready": {
    english: "Feedback ready!",
    hinglish: "Feedback tayyar hai!",
    hindi: "प्रतिक्रिया तैयार है!",
  },
  "writing_coach.error": {
    english: "Could not analyze writing. Please try again.",
    hinglish: "Writing analyze nahi ho saki. Dobara koshish karo.",
    hindi: "लेखन का विश्लेषण नहीं हो सका। फिर से कोशिश करें।",
  },
  "writing_coach.subject_example": {
    english: "e.g. English, History",
    hinglish: "jaise English, History",
    hindi: "जैसे अंग्रेजी, इतिहास",
  },
  "writing_coach.topic_example": {
    english: "e.g. Essay on Democracy",
    hinglish: "jaise Democracy par essay",
    hindi: "जैसे लोकतंत्र पर निबंध",
  },
  "writing_coach.writing_placeholder": {
    english:
      "Type your essay, story, or answer here (minimum 50 characters)...",
    hinglish:
      "Apna essay, kahani ya answer type karo (kam se kam 50 characters)...",
    hindi: "अपना निबंध, कहानी या उत्तर यहाँ टाइप करें (कम से कम 50 वर्ण)...",
  },

  // QUESTION GENERATOR (25)
  "question_generator.title": {
    english: "Question Generator",
    hinglish: "Question Generator",
    hindi: "सवाल जनरेटर",
  },
  "question_generator.subtitle": {
    english: "Generate practice questions at all difficulty levels",
    hinglish: "Sab difficulty levels par practice questions generate karo",
    hindi: "सभी कठिनाई स्तरों पर अभ्यास प्रश्न उत्पन्न करें",
  },
  "question_generator.for_any_topic": {
    english: "Generate questions for any topic",
    hinglish: "Kisi bhi topic ke liye questions generate karo",
    hindi: "किसी भी विषय के लिए प्रश्न उत्पन्न करें",
  },
  "question_generator.subject": {
    english: "Subject",
    hinglish: "Subject",
    hindi: "विषय",
  },
  "question_generator.topic": {
    english: "Topic",
    hinglish: "Topic",
    hindi: "विषय",
  },
  "question_generator.per_level": {
    english: "Per Level",
    hinglish: "Per Level",
    hindi: "प्रति स्तर",
  },
  "question_generator.generate": {
    english: "Generate Questions",
    hinglish: "Questions Generate Karo",
    hindi: "प्रश्न उत्पन्न करें",
  },
  "question_generator.easy": {
    english: "Easy",
    hinglish: "Aasan",
    hindi: "आसान",
  },
  "question_generator.medium": {
    english: "Medium",
    hinglish: "Bilkul Beech Mein",
    hindi: "मध्यम",
  },
  "question_generator.hard": {
    english: "Hard",
    hinglish: "Kathin",
    hindi: "कठिन",
  },
  "question_generator.thinking": {
    english: "Thinking",
    hinglish: "Socho",
    hindi: "सोचो",
  },
  "question_generator.coverage": {
    english: "Coverage",
    hinglish: "Coverage",
    hindi: "कवरेज",
  },
  "question_generator.total": {
    english: "total",
    hinglish: "total",
    hindi: "कुल",
  },
  "question_generator.reveal": {
    english: "Reveal Answer",
    hinglish: "Answer Reveal Karo",
    hindi: "उत्तर प्रकट करें",
  },
  "question_generator.hide": {
    english: "Hide Answer",
    hinglish: "Answer Chupao",
    hindi: "उत्तर छिपाएँ",
  },
  "question_generator.generating": {
    english: "Generating questions...",
    hinglish: "Questions generate ho rahe hain...",
    hindi: "प्रश्न उत्पन्न हो रहे हैं...",
  },

  // DASHBOARD (35)
  "dashboard.greeting": {
    english: "Good evening",
    hinglish: "Good evening",
    hindi: "शुभ संध्या",
  },
  "dashboard.quick_start": {
    english: "Quick Start",
    hinglish: "Quick Start",
    hindi: "तेज़ शुरुआत",
  },
  "dashboard.understand_class": {
    english: "Understand Class",
    hinglish: "Class Samjho",
    hindi: "कक्षा समझें",
  },
  "dashboard.vision_lens": {
    english: "Vision Lens",
    hinglish: "Vision Lens",
    hindi: "विजन लेंस",
  },
  "dashboard.maths_helper": {
    english: "Maths Helper",
    hinglish: "Maths Helper",
    hindi: "गणित सहायक",
  },
  "dashboard.study_planner": {
    english: "Study Planner",
    hinglish: "Study Planner",
    hindi: "अध्ययन योजनाकार",
  },
  "dashboard.auto_revision": {
    english: "Auto Revision",
    hinglish: "Auto Revision",
    hindi: "स्वचालित संशोधन",
  },
  "dashboard.question_bank": {
    english: "Question Bank",
    hinglish: "Question Bank",
    hindi: "प्रश्न बैंक",
  },
  "dashboard.todays_missions": {
    english: "Today's Missions",
    hinglish: "Aaj Ka Mission",
    hindi: "आज का मिशन",
  },
  "dashboard.weekly_leaderboard": {
    english: "Weekly Leaderboard",
    hinglish: "Weekly Leaderboard",
    hindi: "साप्ताहिक लीडरबोर्ड",
  },
  "dashboard.your_badges": {
    english: "Your Badges",
    hinglish: "Aapke Badges",
    hindi: "आपके बैज",
  },
  "dashboard.day_streak": {
    english: "Day Streak",
    hinglish: "Day Streak",
    hindi: "दिन की स्ट्रीक",
  },
  "dashboard.last_7_days": {
    english: "Last 7 Days",
    hinglish: "Pichle 7 Din",
    hindi: "पिछले 7 दिन",
  },
  "dashboard.xp_to_badge": {
    english: "XP to Badge",
    hinglish: "XP to Badge",
    hindi: "बैज के लिए एक्सपी",
  },
  "dashboard.done_today": {
    english: "Done today!",
    hinglish: "Aaj ho gaya!",
    hindi: "आज हो गया!",
  },
  "dashboard.not_yet": {
    english: "Not yet today",
    hinglish: "Aaj abhi nahi",
    hindi: "आज अभी नहीं",
  },
  "dashboard.score": { english: "Score", hinglish: "Score", hindi: "अंक" },
  "dashboard.power_hour_active": {
    english: "Power Hour Active!",
    hinglish: "Power Hour Active!",
    hindi: "पावर आवर सक्रिय!",
  },
  "dashboard.double_xp": {
    english: "2× XP",
    hinglish: "2× XP",
    hindi: "2× एक्सपी",
  },
  "dashboard.complete_missions": {
    english: "Complete missions for double XP!",
    hinglish: "Double XP ke liye missions complete karo!",
    hindi: "दोगुने एक्सपी के लिए मिशन पूरे करें!",
  },
  "dashboard.set_power_hour": {
    english: "Set Your Power Hour",
    hinglish: "Aapka Power Hour Set Karo",
    hindi: "अपना पावर आवर सेट करें",
  },
  "dashboard.hour": { english: "Hour", hinglish: "Hour", hindi: "घंटा" },
  "dashboard.minute": { english: "Minute", hinglish: "Minute", hindi: "मिनट" },
  "dashboard.lock_in": {
    english: "Lock In",
    hinglish: "Lock In Karo",
    hindi: "लॉक इन करें",
  },
  "dashboard.locked": {
    english: "Locked",
    hinglish: "Locked",
    hindi: "लॉक किया गया",
  },
  "dashboard.all_done": {
    english: "All done! 🎉",
    hinglish: "Sab ho gaya! 🎉",
    hindi: "सब हो गया! 🎉",
  },
  "dashboard.tasks": { english: "tasks", hinglish: "tasks", hindi: "कार्य" },
  "dashboard.total_xp": {
    english: "Total XP",
    hinglish: "Total XP",
    hindi: "कुल एक्सपी",
  },
  "dashboard.level": { english: "Level", hinglish: "Level", hindi: "स्तर" },
  "dashboard.streak": {
    english: "Streak",
    hinglish: "Streak",
    hindi: "स्ट्रीक",
  },
  "dashboard.study_time": {
    english: "Study Time",
    hinglish: "Study Time",
    hindi: "अध्ययन समय",
  },
  "dashboard.points": { english: "Points", hinglish: "Points", hindi: "अंक" },
  "dashboard.badges": { english: "Badges", hinglish: "Badges", hindi: "बैज" },

  // MENTOR (20)
  "mentor.title": {
    english: "Your AI Mentor",
    hinglish: "Aapka AI Mentor",
    hindi: "आपका एआई मेंटर",
  },
  "mentor.subtitle": {
    english: "Personalised guidance, motivation & someone to talk to",
    hinglish: "Personal guidance, motivation aur kisi se baat karne ke liye",
    hindi: "व्यक्तिगत मार्गदर्शन, प्रेरणा और बात करने के लिए कोई",
  },
  "mentor.daily_brief": {
    english: "Daily Brief",
    hinglish: "Daily Brief",
    hindi: "दैनिक संक्षिप्त",
  },
  "mentor.chat": {
    english: "Chat with Mentor",
    hinglish: "Mentor ke Saath Chat Karo",
    hindi: "मेंटर के साथ चैट करें",
  },
  "mentor.how_feeling": {
    english: "How are you feeling today?",
    hinglish: "Aaj aap kaise feel kar rahe ho?",
    hindi: "आज आप कैसा महसूस कर रहे हैं?",
  },
  "mentor.great": {
    english: "Great",
    hinglish: "Bahut Accha",
    hindi: "शानदार",
  },
  "mentor.okay": { english: "Okay", hinglish: "Theek Hai", hindi: "ठीक है" },
  "mentor.struggling": {
    english: "Struggling",
    hinglish: "Mushkil Mein",
    hindi: "संघर्ष कर रहे हैं",
  },
  "mentor.tired": { english: "Tired", hinglish: "Thak Gaya", hindi: "थक गया" },
  "mentor.excited": {
    english: "Excited",
    hinglish: "Excited",
    hindi: "उत्साहित",
  },
  "mentor.welcome": {
    english: "Hey! I'm your AI Mentor. What's on your mind today?",
    hinglish: "Hey! Main aapka AI Mentor hoon. Aaj aapke man mein kya hai?",
    hindi: "नमस्ते! मैं आपका एआई मेंटर हूँ। आज आपके मन में क्या है?",
  },
  "mentor.mood_recorded": {
    english: "Mood recorded! Keep going 💪",
    hinglish: "Mood record ho gaya! Aage badho 💪",
    hindi: "मनोदशा दर्ज हो गई! आगे बढ़ते रहो 💪",
  },
  "mentor.preparing": {
    english: "Your mentor is preparing a message for you…",
    hinglish: "Aapke mentor ke liye ek message tayyar kar rahe hain…",
    hindi: "आपके मेंटर के लिए एक संदेश तैयार किया जा रहा है…",
  },

  // LEADERBOARD (18)
  "leaderboard.title": {
    english: "Leaderboard",
    hinglish: "Leaderboard",
    hindi: "लीडरबोर्ड",
  },
  "leaderboard.weekly": {
    english: "Weekly Rankings",
    hinglish: "Weekly Rankings",
    hindi: "साप्ताहिक रैंकिंग",
  },
  "leaderboard.info": {
    english: "Resets on Monday",
    hinglish: "Monday ko reset hota hai",
    hindi: "सोमवार को रीसेट होता है",
  },
  "leaderboard.standings": {
    english: "Your Standing This Week",
    hinglish: "Is Hafta Aapka Standing",
    hindi: "इस हफ्ते आपकी स्थिति",
  },
  "leaderboard.rank": { english: "Rank", hinglish: "Rank", hindi: "रैंक" },
  "leaderboard.xp_week": {
    english: "XP this week",
    hinglish: "Is hafta XP",
    hindi: "इस हफ्ते एक्सपी",
  },
  "leaderboard.streak": {
    english: "Streak",
    hinglish: "Streak",
    hindi: "स्ट्रीक",
  },
  "leaderboard.days": { english: "Days", hinglish: "Din", hindi: "दिन" },
  "leaderboard.hours": { english: "Hours", hinglish: "Ghante", hindi: "घंटे" },
  "leaderboard.mins": { english: "Mins", hinglish: "Minut", hindi: "मिनट" },
  "leaderboard.secs": { english: "Secs", hinglish: "Sec", hindi: "सेकंड" },
  "leaderboard.behind": {
    english: "You're behind",
    hinglish: "Tum peeche ho",
    hindi: "आप पीछे हैं",
  },
  "leaderboard.keep_going": {
    english: "keep going!",
    hinglish: "aage badho!",
    hindi: "आगे बढ़ो!",
  },
  "leaderboard.tied": {
    english: "You're tied with the person above you — push harder!",
    hinglish: "Tum upar wale ke saath tie ho — aur mehnat karo!",
    hindi: "आप ऊपर वाले के साथ बराबर हैं — और कड़ी मेहनत करो!",
  },
  "leaderboard.load_error": {
    english: "Couldn't load leaderboard",
    hinglish: "Leaderboard load nahi ho saka",
    hindi: "लीडरबोर्ड लोड नहीं हो सका",
  },
  "leaderboard.try_again": {
    english: "Try again",
    hinglish: "Dobara Koshish Karo",
    hindi: "फिर से कोशिश करें",
  },

  // STUDY PLANNER (20)
  "study_planner.title": {
    english: "Study Planner",
    hinglish: "Study Planner",
    hindi: "अध्ययन योजनाकार",
  },
  "study_planner.subtitle": {
    english: "Get your personalised daily micro-tasks",
    hinglish: "Apna personalised daily micro-tasks pao",
    hindi: "अपने व्यक्तिगत दैनिक माइक्रो-कार्य प्राप्त करें",
  },
  "study_planner.waiting": {
    english: "Your daily plan is waiting",
    hinglish: "Aapki daily plan wait kar rahi hai",
    hindi: "आपकी दैनिक योजना प्रतीक्षा कर रही है",
  },
  "study_planner.click_generate": {
    english: 'Click "Generate Plan" to get AI-powered micro-tasks for today',
    hinglish:
      'Aaj ke liye AI-powered micro-tasks pane ke liye "Generate Plan" click karo',
    hindi:
      'आज के लिए एआई-संचालित माइक्रो-कार्य प्राप्त करने के लिए "योजना उत्पन्न करें" पर क्लिक करें',
  },
  "study_planner.generate": {
    english: "Generate Plan",
    hinglish: "Plan Generate Karo",
    hindi: "योजना उत्पन्न करें",
  },
  "study_planner.total_time": {
    english: "Total Study Time Today",
    hinglish: "Aaj Total Study Time",
    hindi: "आज कुल अध्ययन समय",
  },
  "study_planner.min": { english: "min", hinglish: "min", hindi: "मिनट" },
  "study_planner.progress": {
    english: "Progress",
    hinglish: "Progress",
    hindi: "प्रगति",
  },
  "study_planner.weekly_goals": {
    english: "Weekly Goals",
    hinglish: "Weekly Goals",
    hindi: "साप्ताहिक लक्ष्य",
  },
  "study_planner.study_tip": {
    english: "Study Tip",
    hinglish: "Study Tip",
    hindi: "अध्ययन सुझाव",
  },
  "study_planner.motivation": {
    english: "Motivational Message",
    hinglish: "Motivational Message",
    hindi: "प्रेरणास्पद संदेश",
  },
  "study_planner.revise": {
    english: "revise",
    hinglish: "revise",
    hindi: "संशोधन",
  },
  "study_planner.read": { english: "read", hinglish: "read", hindi: "पढ़ें" },
  "study_planner.solve": {
    english: "solve",
    hinglish: "solve",
    hindi: "हल करें",
  },
  "study_planner.write": {
    english: "write",
    hinglish: "write",
    hindi: "लिखें",
  },
  "study_planner.practice": {
    english: "practice",
    hinglish: "practice",
    hindi: "अभ्यास",
  },
  "study_planner.generating": {
    english: "Generating your plan...",
    hinglish: "Aapki plan generate ho rahi hai...",
    hindi: "आपकी योजना उत्पन्न हो रही है...",
  },
  "study_planner.generated": {
    english: "Plan generated! 🎉",
    hinglish: "Plan generate ho gaya! 🎉",
    hindi: "योजना उत्पन्न हुई! 🎉",
  },
  "study_planner.error": {
    english: "Couldn't generate plan",
    hinglish: "Plan generate nahi ho saka",
    hindi: "योजना उत्पन्न नहीं हो सकी",
  },

  // PARENT DASHBOARD (15)
  "parent.title": {
    english: "Parent Dashboard",
    hinglish: "Parent Dashboard",
    hindi: "अभिभावक डैशबोर्ड",
  },
  "parent.my_children": {
    english: "My Children",
    hinglish: "Mere Bacche",
    hindi: "मेरे बच्चे",
  },
  "parent.performance": {
    english: "Student Performance",
    hinglish: "Student Performance",
    hindi: "छात्र प्रदर्शन",
  },
  "parent.insights": {
    english: "Learning Insights",
    hinglish: "Learning Insights",
    hindi: "सीखने के अंतर्दृष्टि",
  },
  "parent.weekly_report": {
    english: "Weekly Report",
    hinglish: "Weekly Report",
    hindi: "साप्ताहिक रिपोर्ट",
  },
  "parent.link_child": {
    english: "Link Child Account",
    hinglish: "Child Account Link Karo",
    hindi: "बाल खाता लिंक करें",
  },
  "parent.view_progress": {
    english: "View Progress",
    hinglish: "Progress Dekho",
    hindi: "प्रगति देखें",
  },
  "parent.messages": {
    english: "Messages",
    hinglish: "Messages",
    hindi: "संदेश",
  },
  "parent.add_child": {
    english: "Add Child",
    hinglish: "Baccha Add Karo",
    hindi: "बाल जोड़ें",
  },
  "parent.view_details": {
    english: "View Details",
    hinglish: "Details Dekho",
    hindi: "विवरण देखें",
  },
  "parent.weekly_stats": {
    english: "Weekly Stats",
    hinglish: "Weekly Stats",
    hindi: "साप्ताहिक आंकड़े",
  },
  "parent.subject_wise": {
    english: "Subject-wise Performance",
    hinglish: "Subject-wise Performance",
    hindi: "विषय-वार प्रदर्शन",
  },
  "parent.time_spent": {
    english: "Time Spent",
    hinglish: "Time Spent",
    hindi: "बिताया गया समय",
  },
  "parent.topics_covered": {
    english: "Topics Covered",
    hinglish: "Topics Covered",
    hindi: "कवर किए गए विषय",
  },

  // DASHBOARD - EXTENDED (35 new keys)
  "dashboard.power_hour_locked_in": {
    english: "⚡ Power Hour — Locked In",
    hinglish: "⚡ Power Hour — Lock Ho Gaya",
    hindi: "⚡ पावर आवर — लॉक किया गया",
  },
  "dashboard.fires_every_day_at": {
    english: "Fires every day at",
    hinglish: "Har din chalti hai",
    hindi: "हर दिन चलती है",
  },
  "dashboard.for_60_minutes": {
    english: "for 60 minutes",
    hinglish: "60 minit ke liye",
    hindi: "60 मिनट के लिए",
  },
  "dashboard.cannot_change_power_hour": {
    english: "Cannot change until {date}. {days} day{s} of 2× XP left!",
    hinglish: "{date} tak change nahi kar sakte. {days} din XP baaki hai!",
    hindi: "{date} तक बदल नहीं सकते। {days} दिन एक्सपी बाकी है!",
  },
  "dashboard.power_hour_form_helper": {
    english:
      "Pick a time — every day this month you get 2× XP. Choose carefully — locked until {date}!",
    hinglish:
      "Ek samay choose karo — is mahine har din 2× XP milega. Dhyan se socho — {date} tak lock rahega!",
    hindi:
      "एक समय चुनें — इस महीने हर दिन 2× एक्सपी मिलेगा। सावधानीपूर्वक सोचो — {date} तक लॉक रहेगा!",
  },
  "dashboard.power_hour_days_left": {
    english: "{days} day{s} left",
    hinglish: "{days} din baaki",
    hindi: "{days} दिन बाकी",
  },
  "dashboard.default_user_name": {
    english: "Scholar",
    hinglish: "Scholar",
    hindi: "विद्वान",
  },
  "dashboard.setup_profile_hint": {
    english: "Set up your profile to get started",
    hinglish: "Apna profile setup karo shuru karne ke liye",
    hindi: "शुरू करने के लिए अपनी प्रोफ़ाइल सेट करें",
  },
  "dashboard.level_up_mode_badge": {
    english: "Level Up Mode",
    hinglish: "Level Up Mode",
    hindi: "स्तर ऊपर मोड",
  },
  "dashboard.loading": {
    english: "Loading your dashboard…",
    hinglish: "Aapka dashboard load ho raha hai…",
    hindi: "आपका डैशबोर्ड लोड हो रहा है…",
  },
  "dashboard.leaderboard_full_board_link": {
    english: "Full board",
    hinglish: "Pura board",
    hindi: "पूरा बोर्ड",
  },
  "dashboard.leaderboard_youre": {
    english: "You're",
    hinglish: "Tum ho",
    hindi: "आप हैं",
  },
  "dashboard.leaderboard_this_week": {
    english: "this week",
    hinglish: "is hafta",
    hindi: "इस हफ्ते",
  },
  "dashboard.leaderboard_no_rank_hint": {
    english: "Complete missions to rank up!",
    hinglish: "Missions complete karo rank badhane ke liye!",
    hindi: "रैंक बढ़ाने के लिए मिशन पूरे करें!",
  },
  "dashboard.streak_shield_singular": {
    english: "Streak Shield",
    hinglish: "Streak Shield",
    hindi: "स्ट्रीक ढाल",
  },
  "dashboard.streak_shields_plural": {
    english: "Streak Shields",
    hinglish: "Streak Shields",
    hindi: "स्ट्रीक ढालें",
  },
  "dashboard.shield_earned_tooltip": {
    english: "Earned every 7 days. Auto-saves if you miss a day.",
    hinglish: "Har 7 din mein milti hai. Ek din miss ho to save kar deti hai.",
    hindi: "हर 7 दिन में मिलती है। एक दिन मिस हो तो सहेज देती है।",
  },
  "dashboard.shield_info_tooltip": {
    english:
      "Earn at every 7-day milestone. Auto-saves your streak if you miss a day.",
    hinglish:
      "Har 7-din milestone par milti hai. Ek din miss ho to streak save kar deti hai.",
    hindi:
      "हर 7 दिन के मील के पत्थर पर मिलती है। एक दिन मिस हो तो स्ट्रीक सहेज देती है।",
  },
  "dashboard.no_shields_yet_hint": {
    english: "No shields yet. Reach a 7-day streak to earn one!",
    hinglish: "Abhi shields nahi hai. 7-din streak paao aur ek earn karo!",
    hindi: "अभी ढालें नहीं हैं। 7 दिन की स्ट्रीक पाओ और एक कमाओ!",
  },
  "dashboard.lock_in_notice": {
    english: "Locked until {date}.",
    hinglish: "{date} tak lock hoga.",
    hindi: "{date} तक लॉक रहेगा।",
  },
  "dashboard.leaderboard_your_rank": {
    english: "You're #{rank}",
    hinglish: "Tum #{rank}",
    hindi: "आप #{rank}",
  },
  "dashboard.missions_partial_complete_msg": {
    english: "{remaining} mission{s} left to complete today 💪",
    hinglish: "{remaining} mission{s} aaj complete karne baaki hai 💪",
    hindi: "{remaining} मिशन{s} आज पूरा करने बाकी है 💪",
  },
  "dashboard.xp_to": {
    english: "XP to",
    hinglish: "XP to",
    hindi: "एक्सपी को",
  },
  "dashboard.day_badge_suffix": {
    english: "-Day Badge",
    hinglish: "-Din Badge",
    hindi: "-दिन बैज",
  },
  "dashboard.score_label": {
    english: "Score:",
    hinglish: "Score:",
    hindi: "स्कोर:",
  },
  "dashboard.missions_0_complete_msg": {
    english: "Complete missions to build your streak 🔥",
    hinglish: "Missions complete karo apni streak banane ke liye 🔥",
    hindi: "अपनी स्ट्रीक बनाने के लिए मिशन पूरे करो 🔥",
  },
  "dashboard.missions_100_complete_msg": {
    english: "Streak secured for today! 🔥",
    hinglish: "Aaj ke liye streak secure! 🔥",
    hindi: "आज के लिए स्ट्रीक सुरक्षित! 🔥",
  },
  "dashboard.missions_remaining_single": {
    english: "1 mission",
    hinglish: "1 mission",
    hindi: "1 मिशन",
  },
  "dashboard.missions_remaining_plural": {
    english: "{n} missions",
    hinglish: "{n} missions",
    hindi: "{n} मिशन",
  },
  "dashboard.no_missions_empty_state": {
    english: "No missions yet — your Study Planner will generate them.",
    hinglish: "Abhi missions nahi — aapka Study Planner banayega.",
    hindi: "अभी मिशन नहीं — आपका अध्ययन योजनाकार उन्हें बनाएगा।",
  },
  "dashboard.generate_plan_link": {
    english: "Generate my plan →",
    hinglish: "Mere liye plan banao →",
    hindi: "मेरे लिए योजना बनाओ →",
  },

  // MILESTONE (15 new keys)
  "milestone.7day_title": {
    english: "7-DAY STREAK!",
    hinglish: "7-DIN STREAK!",
    hindi: "7-दिन की स्ट्रीक!",
  },
  "milestone.7day_subtitle": {
    english: "You studied 7 days in a row. Incredible focus!",
    hinglish: "Tum 7 din lgataar padhe. Zabardast focus!",
    hindi: "आप 7 दिन लगातार पढ़े। शानदार ध्यान!",
  },
  "milestone.7day_badge": {
    english: "Week Warrior",
    hinglish: "Week Warrior",
    hindi: "सप्ताह योद्धा",
  },
  "milestone.14day_title": {
    english: "14-DAY STREAK!",
    hinglish: "14-DIN STREAK!",
    hindi: "14-दिन की स्ट्रीक!",
  },
  "milestone.14day_subtitle": {
    english: "Two weeks straight. You're building a real habit!",
    hinglish: "Do hafte lgataar. Tum asli habit bana rahe ho!",
    hindi: "दो हफ्ते लगातार। आप एक वास्तविक आदत बना रहे हैं!",
  },
  "milestone.14day_badge": {
    english: "Fortnight Force",
    hinglish: "Fortnight Force",
    hindi: "पखवाड़ा बल",
  },
  "milestone.30day_title": {
    english: "30-DAY STREAK!",
    hinglish: "30-DIN STREAK!",
    hindi: "30-दिन की स्ट्रीक!",
  },
  "milestone.30day_subtitle": {
    english: "A full month of learning. You are absolutely legendary.",
    hinglish: "Ek pura mahina sikhna. Tum bilkul legendary ho.",
    hindi: "एक पूरा महीना सीखना। आप बिल्कुल किंवदंती हैं।",
  },
  "milestone.30day_badge": {
    english: "Monthly Master",
    hinglish: "Monthly Master",
    hindi: "मासिक मास्टर",
  },
  "milestone.word_amazing": {
    english: "AMAZING!",
    hinglish: "AMAZING!",
    hindi: "अद्भुत!",
  },
  "milestone.word_you_did_it": {
    english: "YOU DID IT!",
    hinglish: "TUM KAR LIYE!",
    hindi: "तुमने किया!",
  },
  "milestone.word_legendary": {
    english: "LEGENDARY!",
    hinglish: "LEGENDARY!",
    hindi: "किंवदंती!",
  },
  "milestone.word_on_fire": {
    english: "ON FIRE!",
    hinglish: "ON FIRE!",
    hindi: "आग पर!",
  },
  "milestone.word_unstoppable": {
    english: "UNSTOPPABLE!",
    hinglish: "UNSTOPPABLE!",
    hindi: "अरोक!",
  },
  "milestone.keep_it_up_cta": {
    english: "Keep it up! 🚀",
    hinglish: "Aage badho! 🚀",
    hindi: "आगे बढ़ो! 🚀",
  },
  "milestone.auto_closes_hint": {
    english: "Closes automatically in a few seconds",
    hinglish: "Kuch seconds mein auto-close ho jayega",
    hindi: "कुछ सेकंड में स्वचालित रूप से बंद हो जाएगा",
  },
  "milestone.day_streak_label": {
    english: "Day Streak",
    hinglish: "Din Streak",
    hindi: "दिन की स्ट्रीक",
  },
  "dashboard.day_streak_label": {
    english: "Day Streak",
    hinglish: "Din Streak",
    hindi: "दिन की स्ट्रीक",
  },

  // GREETINGS (3 new keys)
  "greeting.morning": {
    english: "Good morning",
    hinglish: "Good morning",
    hindi: "सुप्रभात",
  },
  "greeting.afternoon": {
    english: "Good afternoon",
    hinglish: "Good afternoon",
    hindi: "शुभ दोपहर",
  },
  "greeting.evening": {
    english: "Good evening",
    hinglish: "Good evening",
    hindi: "शुभ संध्या",
  },

  // COMMON - EXTENDED (16 new keys)
  "common.saving": {
    english: "Saving…",
    hinglish: "Save ho raha hai…",
    hindi: "सहेज रहे हैं…",
  },
  "common.view_all": {
    english: "View all",
    hinglish: "Sab Dekho",
    hindi: "सब देखें",
  },
  "common.time_min": { english: "min", hinglish: "min", hindi: "मिनट" },
  "common.time_sec": { english: "sec", hinglish: "sec", hindi: "सेकंड" },
  "common.day_abbr_su": { english: "Su", hinglish: "Su", hindi: "रवि" },
  "common.day_abbr_mo": { english: "Mo", hinglish: "Mo", hindi: "सोम" },
  "common.day_abbr_tu": { english: "Tu", hinglish: "Tu", hindi: "मंगल" },
  "common.day_abbr_we": { english: "We", hinglish: "We", hindi: "बुध" },
  "common.day_abbr_th": { english: "Th", hinglish: "Th", hindi: "गुरु" },
  "common.day_abbr_fr": { english: "Fr", hinglish: "Fr", hindi: "शुक्र" },
  "common.day_abbr_sa": { english: "Sa", hinglish: "Sa", hindi: "शनि" },
  "common.points_abbr": { english: "pts", hinglish: "pts", hindi: "अंक" },
  "common.remaining_left": {
    english: "left",
    hinglish: "baaki",
    hindi: "बाकी",
  },
  "common.priority_high": { english: "high", hinglish: "high", hindi: "उच्च" },
  "common.priority_medium": {
    english: "medium",
    hinglish: "medium",
    hindi: "मध्यम",
  },
  "common.priority_low": { english: "low", hinglish: "low", hindi: "कम" },

  // MENTOR - EXTENDED
  "mentor.modal_cta": {
    english: "Let's go! 🚀",
    hinglish: "Chalo! 🚀",
    hindi: "चलो! 🚀",
  },
  "mentor.refresh": {
    english: "Refresh",
    hinglish: "Refresh Karo",
    hindi: "ताज़ा करें",
  },
  "mentor.recent_feedback": {
    english: "Recent Feedback",
    hinglish: "Recent Feedback",
    hindi: "हाल की प्रतिक्रिया",
  },
  "mentor.today_action": {
    english: "Today's Action",
    hinglish: "Aaj Ka Action",
    hindi: "आज का कार्य",
  },
  "mentor.chat_cta": {
    english: "Chat with your Mentor about anything →",
    hinglish: "Apne Mentor se kisi bhi baare mein baat karo →",
    hindi: "अपने मेंटर के साथ कुछ भी बात करें →",
  },
  "mentor.session_memory": {
    english: "Your mentor remembers this conversation during your session",
    hinglish: "Aapka mentor is baat ko aapke session mein yaad rakhta hai",
    hindi: "आपका मेंटर इस बातचीत को आपके सेशन के दौरान याद रखता है",
  },
  "mentor.type_message": {
    english: "Type your message… (Enter to send, Shift+Enter for new line)",
    hinglish:
      "Aapna message likho… (Enter se bhejo, Shift+Enter nayi line ke liye)",
    hindi:
      "अपना संदेश टाइप करें… (भेजने के लिए Enter, नई लाइन के लिए Shift+Enter)",
  },
  "mentor.load_error": {
    english: "Couldn't load your mentor message",
    hinglish: "Mentor ka message load nahi ho saka",
    hindi: "मेंटर का संदेश लोड नहीं हो सका",
  },
  "mentor.connection_error": {
    english: "Connection error. Please try again.",
    hinglish: "Connection error. Dobara koshish karo.",
    hindi: "कनेक्शन त्रुटि। फिर से कोशिश करें।",
  },
  "mentor.felt_dialog": {
    english: '✓ You said you\'re feeling "{mood}" today',
    hinglish: '✓ Tum ne kaha ki aaj aap "{mood}" feel kar rahe ho',
    hindi: '✓ आपने कहा कि आज आप "{mood}" महसूस कर रहे हैं',
  },
  "mentor.talk_about": {
    english: "Talk to Mentor about it",
    hinglish: "Mentor se iske baare mein baat karo",
    hindi: "इसके बारे में मेंटर से बात करें",
  },

  // QUESTION GENERATOR - EXTENDED
  "question_generator.subject_placeholder": {
    english: "e.g., Physics",
    hinglish: "e.g., Physics",
    hindi: "उदाहरण: भौतिकी",
  },
  "question_generator.topic_placeholder": {
    english: "e.g., Newton's Laws",
    hinglish: "e.g., Newton's Laws",
    hindi: "उदाहरण: न्यूटन के नियम",
  },
  "question_generator.coverage_label": {
    english: "Coverage:",
    hinglish: "Coverage:",
    hindi: "कवरेज:",
  },
  "question_generator.no_questions": {
    english: "No questions generated for this level",
    hinglish: "Is level ke liye koi bhi question generate nahi hua",
    hindi: "इस स्तर के लिए कोई प्रश्न उत्पन्न नहीं हुआ",
  },
  "question_generator.error": {
    english: "Couldn't generate questions",
    hinglish: "Questions generate nahi ho sake",
    hindi: "प्रश्न उत्पन्न नहीं हो सके",
  },
  "question_generator.generated": {
    english: "Generated {count} questions! 🎉",
    hinglish: "{count} questions generate ho gaye! 🎉",
    hindi: "{count} प्रश्न उत्पन्न हुए! 🎉",
  },

  // VISION LENS - EXTENDED
  "vision_lens.question_placeholder": {
    english: "Ask anything about this image...",
    hinglish: "Is image ke baare mein kuch bhi puchho...",
    hindi: "इस छवि के बारे में कुछ भी पूछें...",
  },
  "vision_lens.error_upload_image": {
    english: "Please upload a valid image",
    hinglish: "Ek valid image upload karo",
    hindi: "एक वैध छवि अपलोड करें",
  },
  "vision_lens.error_upload_image_first": {
    english: "Please upload an image first",
    hinglish: "Pehle ek image upload karo",
    hindi: "पहले एक छवि अपलोड करें",
  },
  "vision_lens.success_analysed": {
    english: "Image analyzed! 👀",
    hinglish: "Image analyze ho gaya! 👀",
    hindi: "छवि का विश्लेषण किया गया! 👀",
  },
  "vision_lens.error_analyse": {
    english: "Couldn't analyze the image",
    hinglish: "Image analyze nahi ho saka",
    hindi: "छवि का विश्लेषण नहीं हो सका",
  },

  // COMMON - ADDITIONAL KEYS
  "common.browse": {
    english: "browse",
    hinglish: "browse",
    hindi: "ब्राउज़ करें",
  },
  "common.enter_question": {
    english: "Please enter a question",
    hinglish: "Ek question likho",
    hindi: "कृपया एक सवाल दर्ज करें",
  },
  "common.analysing": {
    english: "Analysing...",
    hinglish: "Analyze ho raha hai...",
    hindi: "विश्लेषण किया जा रहा है...",
  },
  "common.ask": { english: "Ask", hinglish: "Puchho", hindi: "पूछें" },
  "common.fill_fields": {
    english: "Please fill all fields",
    hinglish: "Sab fields fill karo",
    hindi: "सभी फ़ील्ड भरें",
  },

  // POWER HOUR (30+ keys)
  "power_hour.title": {
    english: "Power Hour",
    hinglish: "Power Hour",
    hindi: "पावर आवर",
  },
  "power_hour.subtitle": {
    english: "Your daily 2× XP boost window",
    hinglish: "Aapka daily 2× XP boost window",
    hindi: "आपकी दैनिक 2× एक्सपी बूस्ट विंडो",
  },
  "power_hour.active": {
    english: "⚡ Power Hour is Active!",
    hinglish: "⚡ Power Hour Active Hai!",
    hindi: "⚡ पावर आवर सक्रिय है!",
  },
  "power_hour.double_xp": {
    english: "2× XP on every task",
    hinglish: "Har task par 2× XP",
    hindi: "हर कार्य पर 2× एक्सपी",
  },
  "power_hour.complete_missions": {
    english: "Head to Dashboard and complete missions now to earn double XP!",
    hinglish:
      "Dashboard par jao aur ab missions complete karo double XP paane ke liye!",
    hindi: "डैशबोर्ड पर जाएं और अब मिशन पूरे करें दोगुने एक्सपी पाने के लिए!",
  },
  "power_hour.locked_in": {
    english: "⚡ Power Hour — Locked In",
    hinglish: "⚡ Power Hour — Lock Ho Gaya",
    hindi: "⚡ पावर आवर — लॉक किया गया",
  },
  "power_hour.fires_at": {
    english: "Fires every day at",
    hinglish: "Har din chalti hai",
    hindi: "हर दिन चलती है",
  },
  "power_hour.for_60_min": {
    english: "for 60 minutes",
    hinglish: "60 minit ke liye",
    hindi: "60 मिनट के लिए",
  },
  "power_hour.hour": { english: "Hour", hinglish: "Hour", hindi: "घंटा" },
  "power_hour.minute": { english: "Minute", hinglish: "Minute", hindi: "मिनट" },
  "power_hour.locked": {
    english: "Locked",
    hinglish: "Locked",
    hindi: "लॉक किया गया",
  },
  "power_hour.cannot_change": {
    english: "This cannot be changed until",
    hinglish: "Yeh {date} tak change nahi ho sakta",
    hindi: "यह {date} तक बदला नहीं जा सकता",
  },
  "power_hour.days_remaining": {
    english: "of 2× XP remaining this month!",
    hinglish: "din XP baaki iss mahine!",
    hindi: "दिन एक्सपी इस महीने बाकी है!",
  },
  "power_hour.set_your_hour": {
    english: "Set Your Power Hour",
    hinglish: "Aapka Power Hour Set Karo",
    hindi: "अपना पावर आवर सेट करें",
  },
  "power_hour.pick_time": {
    english: "Pick a time — every day this month you get",
    hinglish: "Ek samay choose karo — is mahine har din milta hai",
    hindi: "एक समय चुनें — इस महीने हर दिन मिलता है",
  },
  "power_hour.for_1_hour": {
    english: "for 1 hour.",
    hinglish: "1 ghante ke liye.",
    hindi: "1 घंटे के लिए।",
  },
  "power_hour.lock_in": {
    english: "Lock In",
    hinglish: "Lock In Karo",
    hindi: "लॉक इन करें",
  },
  "power_hour.days_left": {
    english: "day{s} remaining",
    hinglish: "din baaki",
    hindi: "दिन बाकी",
  },
  "power_hour.saving": {
    english: "Saving…",
    hinglish: "Save ho raha hai…",
    hindi: "सहेज रहे हैं…",
  },
  "power_hour.inactive": {
    english: "Power Hour is",
    hinglish: "Power Hour hai",
    hindi: "पावर आवर है",
  },
  "power_hour.inactive_state": {
    english: "inactive",
    hinglish: "inactive",
    hindi: "निष्क्रिय",
  },
  "power_hour.fire_at_today": {
    english: "It will fire at",
    hinglish: "Yeh chalega",
    hindi: "यह चलेगा",
  },
  "power_hour.today_suffix": {
    english: "today.",
    hinglish: "aaj.",
    hindi: "आज।",
  },
  "power_hour.choose_carefully": {
    english: "Choose carefully —",
    hinglish: "Dhyan se socho —",
    hindi: "सावधानीपूर्वक सोचो —",
  },
  "power_hour.cannot_change_until": {
    english: "this is locked until",
    hinglish: "yeh {date} tak lock hai",
    hindi: "यह {date} तक लॉक है",
  },
  "power_hour.and_cannot_change": {
    english: "and cannot be changed until then.",
    hinglish: "aur tab tak change nahi ho sakta.",
    hindi: "और तब तक बदला नहीं जा सकता।",
  },
  "power_hour.how_it_works": {
    english: "How It Works",
    hinglish: "Kaise Kaam Karta Hai",
    hindi: "कैसे काम करता है",
  },
  "power_hour.pick_once": {
    english: "Pick Your Time Once",
    hinglish: "Ek Bar Apna Samay Chuno",
    hindi: "एक बार अपना समय चुनो",
  },
  "power_hour.pick_once_desc": {
    english:
      "Choose any hour of the day. This becomes your personal Power Hour for the entire month.",
    hinglish:
      "Din ka koi bhi ghanta choose karo. Yeh aapka personal Power Hour poore mahine ke liye ban jata hai.",
    hindi:
      "दिन का कोई भी घंटा चुनें। यह पूरे महीने के लिए आपका व्यक्तिगत पावर आवर बन जाता है।",
  },
  "power_hour.auto_activates": {
    english: "Auto-Activates Daily",
    hinglish: "Har Din Apne Aap Activate Ho Jata Hai",
    hindi: "हर दिन अपने आप सक्रिय हो जाता है",
  },
  "power_hour.auto_desc": {
    english:
      "Every day at your chosen time, Power Hour activates automatically for exactly 60 minutes.",
    hinglish:
      "Har din aapke choose kiye hue samay par, Power Hour apne aap activate ho jata hai 60 minit ke liye.",
    hindi:
      "हर दिन आपके चुने हुए समय पर, पावर आवर अपने आप 60 मिनट के लिए सक्रिय हो जाता है।",
  },
  "power_hour.double_xp_tasks": {
    english: "2× XP on All Tasks",
    hinglish: "Sab Tasks Par 2× XP",
    hindi: "सभी कार्यों पर 2× एक्सपी",
  },
  "power_hour.double_xp_desc": {
    english:
      "Complete any mission during Power Hour and earn double XP — stack it with your streak!",
    hinglish:
      "Power Hour mein koi bhi mission complete karo aur double XP pao — apni streak ke saath stack karo!",
    hindi:
      "पावर आवर में कोई भी मिशन पूरा करो और दोगुना एक्सपी पाओ — अपनी स्ट्रीक के साथ स्टैक करो!",
  },
  "power_hour.build_habit": {
    english: "Build a Habit",
    hinglish: "Adat Banao",
    hindi: "आदत बनाओ",
  },
  "power_hour.build_habit_desc": {
    english:
      "Locking in a time forces you to study at the same hour every day, building a strong habit.",
    hinglish:
      "Ek samay lock karte ho to har din us same ghante par padhna padta hai, ek strong adat banti hai.",
    hindi:
      "एक समय लॉक करने से हर दिन उसी घंटे पर पढ़ना पड़ता है, एक मजबूत आदत बनती है।",
  },
  "power_hour.resets_monthly": {
    english: "Resets Monthly",
    hinglish: "Har Mahine Reset Ho Jata Hai",
    hindi: "हर महीने रीसेट हो जाता है",
  },
  "power_hour.resets_desc": {
    english:
      "On the 1st of every month your schedule clears, so you can pick a new time that suits you.",
    hinglish:
      "Har mahine ke 1st din aapka schedule clear ho jata hai, to tum ek naya samay choose kar sakte ho jo aapko suit kare.",
    hindi:
      "हर महीने की 1st तारीख को आपका शेड्यूल साफ हो जाता है, तो आप एक नया समय चुन सकते हैं जो आपको सूट करे।",
  },

  // STUDY PLANNER - EXTENDED
  "study_planner.tip_prefix": {
    english: "💡 Tip:",
    hinglish: "💡 Tip:",
    hindi: "💡 सुझाव:",
  },
  "study_planner.done": { english: "done", hinglish: "done", hindi: "पूर्ण" },
  "study_planner.tasks_label": {
    english: "tasks",
    hinglish: "tasks",
    hindi: "कार्य",
  },
};

export function t(
  key: string,
  lang: Language,
  params?: Record<string, any>,
): string {
  const entry = translations[key];
  if (!entry) {
    console.warn(`Translation key not found: ${key}`);
    return key;
  }
  let text = entry[lang] || entry.english;

  // Replace placeholders like {param} with actual values
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      text = text.replace(new RegExp(`\\{${key}\\}`, "g"), String(value));
    });

    // Handle {s} pluralization - include 's' if any numeric param is not 1
    const hasPlural = Object.values(params).some(
      v => typeof v === "number" && v !== 1,
    );
    text = text.replace(/{s}/g, hasPlural ? "s" : "");
  }

  return text;
}
