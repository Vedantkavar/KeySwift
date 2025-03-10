const BEGINNER_WORD_LIST = [
  'were', 'do', 'are', 'an', 'much', 'each', 'when', 'could', 'another', 'yet',
  'how', 'who', 'can', 'two', 'which', 'been', 'or', 'he', 'and', 'me', 'these',
  'am', 'any', 'they', 'as', 'when', 'about', 'may', 'where', 'this', 'do',
  'second', 'few', 'had', 'still', 'it', 'then', 'being', 'after', 'if',
  'shall', 'neither', 'many', 'will', 'shall', 'has', 'one', 'where', 'since',
  'such', 'too', 'take', 'however', 'both', 'but', 'even', 'while', 'none',
  'just', 'are', 'whose', 'moreover', 'go', 'did', 'might', 'until', 'me',
  'not', 'thus', 'in', 'therefore', 'every', 'make', 'at', 'has', 'up', 'i',
  'was', 'the', 'say', 'same', 'some', 'us', 'rather', 'on', 'they', 'those',
  'instead', 'have', 'though', 'see', 'must', 'them', 'otherwise', 'which',
  'did', 'how', 'because', 'when', 'first', 'also', 'have', 'own', 'to',
  'besides', 'we', 'would', 'either', 'is', 'why', 'last', 'whom', 'what',
  'we', 'hence', 'only', 'so', 'her', 'he', 'were', 'him', 'here', 'all',
  'before', 'no', 'she', 'it', 'us', 'next', 'had', 'like', 'what', 'almost',
  'that', 'from', 'very', 'get', 'them', 'is', 'should', 'you', 'why', 'who',
  'several', 'by', 'like', 'her', 'will', 'although', 'does', 'can', 'nor',
  'for', 'him', 'come', 'a', 'other', 'down', 'was', 'she', 'quite', 'you',
  'know', 'there', 'with'
];

const MEDIUM_WORD_LIST = [
  'like', 'yesterday', 'otherwise', 'after', 'do', 'important', 'can', 'a', 'since', 'were',
  'therefore', 'so', 'what', 'strong', 'not', 'still', 'must', 'could', 'almost', 'besides',
  'before', 'understand', 'because', 'people', 'very', 'even', 'because', 'was', 'both', 'anyone',
  'is', 'but', 'same', 'midnight', 'nobody', 'whom', 'problem', 'together', 'several', 'friend',
  'nothing', 'better', 'when', 'happen', 'though', 'me', 'should', 'next', 'after', 'such',
  'answer', 'no', 'several', 'neither', 'just', 'have', 'outside', 'listen', 'it', 'are',
  'any', 'without', 'every', 'those', 'two', 'family', 'second', 'improve', 'although', 'she',
  'decide', 'they', 'inside', 'around', 'does', 'the', 'evening', 'when', 'probably', 'hence',
  'everything', 'last', 'us', 'whose', 'how', 'as', 'this', 'has', 'enough', 'am',
  'place', 'might', 'you', 'situation', 'change', 'everyone', 'moment', 'and', 'before', 'an',
  'first', 'yet', 'been', 'he', 'experience', 'own', 'only', 'none', 'believe', 'sometimes',
  'however', 'thus', 'always', 'against', 'instead', 'nor', 'question', 'might', 'may', 'quite',
  'why', 'some', 'them', 'belong', 'instead', 'either', 'under', 'him', 'rather', 'reason',
  'possible', 'happy', 'all', 'also', 'imagine', 'through', 'where', 'few', 'if', 'her',
  'much', 'tomorrow', 'would', 'then', 'morning', 'continue', 'too', 'one', 'again', 'either',
  'or', 'that', 'someone', 'afternoon', 'we', 'promise', 'between', 'different', 'until', 'remember',
  'while', 'explain', 'did', 'morning', 'moreover', 'almost', 'these', 'each', 'should', 'being',
  'shall', 'control', 'another', 'everywhere', 'which', 'other', 'will', 'had', 'really', 'many',
  'who'
];

const ADVANCED_WORD_LIST = [
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'so', 'because', 'as', 
  'when', 'while', 'although', 'though', 'since', 'until', 'before', 'after', 
  'then', 'therefore', 'thus', 'hence', 'also', 'moreover', 'however', 
  'instead', 'otherwise', 'besides', 'yet', 'still', 'even', 'either', 'neither', 
  'not', 'nor', 'only', 'just', 'too', 'very', 'quite', 'rather', 'almost', 
  'such', 'like', 'that', 'this', 'these', 'those', 'each', 'every', 
  'some', 'any', 'many', 'much', 'few', 'several', 'both', 'all', 'no', 
  'none', 'one', 'two', 'first', 'second', 'next', 'last', 'own', 'same', 
  'other', 'another', 'who', 'whom', 'whose', 'which', 'what', 'where', 
  'when', 'why', 'how', 'can', 'could', 'shall', 'should', 'will', 'would', 
  'may', 'might', 'must', 'do', 'does', 'did', 'is', 'are', 'was', 'were', 
  'has', 'have', 'had', 'being', 'been', 'am', 'he', 'she', 'it', 'they', 
  'we', 'you', 'me', 'him', 'her', 'us', 'them',
  'universal', 'perception', 'knowledge', 'opportunity', 'principle', 'consequence', 'philosophy', 'sufficient', 'perspective', 'innovation',
  'determination', 'performance', 'exceptional', 'achievement', 'responsibility', 'efficiency', 'commitment', 'consideration', 'reliability', 'perseverance',
  'fundamental', 'sustainability', 'inspiration', 'motivation', 'capability', 'influential', 'contribution', 'comprehensive', 'improvement', 'collaboration',
  'entrepreneur', 'manifestation', 'significance', 'intelligence', 'extraordinary', 'satisfaction', 'transformation', 'representation', 'appreciation',
  'sophisticated', 'implementation', 'explanation', 'recommendation', 'distinction', 'persuasion', 'investigation', 'intervention', 'clarification', 'modification',
  'complexity', 'fascination', 'interpretation', 'exceptionally', 'unpredictable', 'independently', 'communication', 'organization', 'phenomenon', 'revolutionary'
];