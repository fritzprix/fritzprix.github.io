export type Language = 'ko' | 'en';

export const translations = {
  ko: {
    // Navigation & Header
    search: "검색",
    searchShortcut: "⌘K",
    themeToggle: "테마 변경",
    langToggle: "언어 변경",
    home: "홈",
    email: "이메일",
    github: "GitHub 프로필",
    
    // Home Page
    aboutMeTitle: "About Me",
    postsTitle: "포스트",
    tagsTitle: "태그",
    filterAll: "전체",
    filterKo: "한국어",
    filterEn: "English",
    noPosts: "작성된 포스트가 없습니다.",
    noTags: "태그가 없습니다.",
    
    // Post Detail
    backToPosts: "포스트 목록으로",
    readTime: "읽기",
    words: "단어",
    comments: "댓글",
    relatedPosts: "관련 포스트",
    noRelatedPosts: "관련 포스트가 없습니다.",
    postNotFound: "포스트를 찾을 수 없습니다!",
    goBack: "돌아가기",
    share: "공유하기",
    tableOfContents: "목차",
    
    // Search Overlay
    searchPlaceholder: "포스트 검색 (제목, 내용, 태그)...",
    searchResults: "검색 결과",
    noResults: "결과가 없습니다.",
    searchPrompt: "검색어를 입력해주세요 (2자 이상)",
    searchHintEsc: "닫기",
    searchHintSelect: "선택",
    
    // Newsletter
    newsletterTitle: "뉴스레터",
    newsletterDesc: "새로운 포스트가 올라올 때 이메일로 알려드립니다.",
    newsletterPlaceholder: "이메일 주소",
    newsletterButton: "구독",
    newsletterSuccess: "구독 신청이 완료되었습니다. 곧 연락드리겠습니다.",
    
    // Author Card
    authorBio: "끝없는 호기심과 확고한 결단력으로 복잡한 세상을 탐구하는 방랑자입니다.",
    
    // Footer
    allRightsReserved: "All rights reserved.",
  },
  en: {
    // Navigation & Header
    search: "Search",
    searchShortcut: "⌘K",
    themeToggle: "Toggle theme",
    langToggle: "Change language",
    home: "Home",
    email: "Email",
    github: "GitHub Profile",
    
    // Home Page
    aboutMeTitle: "About Me",
    postsTitle: "Posts",
    tagsTitle: "Tags",
    filterAll: "All",
    filterKo: "한국어",
    filterEn: "English",
    noPosts: "No posts found.",
    noTags: "No tags found.",
    
    // Post Detail
    backToPosts: "Back to posts",
    readTime: "min read",
    words: "words",
    comments: "Comments",
    relatedPosts: "Related Posts",
    noRelatedPosts: "No related posts found.",
    postNotFound: "Post not found!",
    goBack: "Go Back",
    share: "Share",
    tableOfContents: "Table of Contents",
    
    // Search Overlay
    searchPlaceholder: "Search posts (title, content, tags)...",
    searchResults: "Search Results",
    noResults: "No results found.",
    searchPrompt: "Type to search (at least 2 characters)",
    searchHintEsc: "Close",
    searchHintSelect: "Select",
    
    // Newsletter
    newsletterTitle: "Newsletter",
    newsletterDesc: "Get notified when new articles are published.",
    newsletterPlaceholder: "Email address",
    newsletterButton: "Subscribe",
    newsletterSuccess: "Thank you for subscribing. We'll be in touch soon.",
    
    // Author Card
    authorBio: "An anonymous seeker, navigating the complexities of our world through persistent curiosity and unwavering determination.",
    
    // Footer
    allRightsReserved: "All rights reserved.",
  },
} as const;

export type TranslationKey = keyof typeof translations.ko;
