import { Post, ProfileData } from '@/App'; // Import ProfileData type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// import { faker } from '@faker-js/faker'; // No longer needed here
import React from 'react';
import ReactMarkdown from 'react-markdown'; // Import ReactMarkdown
import { SocialIcon } from 'react-social-icons';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm'; // Import plugins
import { MarkdownComponents } from '../components/MarkdownComponents'; // Import custom components
import PostsSection from '../components/PostsSection'; // Adjust path
interface HomePageProps {
    posts: Post[];
    profileData: ProfileData; // Add profileData prop
    aboutMeContent: string; // Add aboutMeContent prop
    initials: string;
    // Removed name prop, it's inside profileData
}


function ProfileSection({ profileData, initials, disable }: { profileData: ProfileData, initials: string, disable: boolean }) {
    const profileImageUrl = profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random`; // Example fallback

    return (
        <section className={`profile-section flex flex-col items-center mb-12 ${disable ? 'hidden' : ''}`}>
            <Avatar className="w-32 h-32 mb-4">
                <AvatarImage src={profileImageUrl} alt={profileData.name} /> {/* Use real name for alt */}
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            {/* Render social links from profileData */}
            <div className="social-badges flex space-x-4">
                {profileData.social.map((link) => (
                    <SocialIcon key={link.name} network={link.icon} className='w-6 h-6' url={link.url} />
                ))}
            </div>
        </section>
    )
}

const HomePage: React.FC<HomePageProps> = ({ posts, profileData, aboutMeContent, initials }) => {
    // Use a placeholder image or get from profileData if available

    return (
        <>
            {/* Header can remain in App.tsx or move here depending on preference */}
            <main className="flex-grow">
                <ProfileSection profileData={profileData} initials={initials} disable={true} />
                <section className="about-me mb-12">
                    <Card>
                        <CardHeader>
                        </CardHeader>
                        <CardContent>
                            {/* Remove prose classes, pass custom components */}
                            <div className="text-justify"> {/* Keep max-w-none if needed, remove prose */}
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={MarkdownComponents} // Pass the custom components
                                >
                                    {aboutMeContent}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <PostsSection posts={posts} />
            </main>
            {/* Footer can remain in App.tsx or move here */}
        </>
    );
};

export default HomePage; 