import { Post, ProfileData } from '@/App'; // Import ProfileData type
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const icons: Record<string, React.ReactNode> = {
    'github': <div className='w-6 h-6 bg-red-500'/>,
    'linkedin': <SocialIcon network='linkedin' className='w-6 h-6' />,
    'twitter': <SocialIcon network='X' className='w-6 h-6' />,
    'facebook': <SocialIcon network='facebook' className='w-6 h-6' />,
    'instagram': <SocialIcon network='instagram' className='w-6 h-6' />,
}

// --- Removed Fake Data Generation for profile/social ---
// const profileImageUrl = faker.image.avatar();
// const socialLinks = [
//   { name: faker.company.name().split(' ')[0], url: '#' },
//   { name: faker.company.name().split(' ')[0], url: '#' },
//   { name: faker.company.name().split(' ')[0], url: '#' },
// ];
// --- End Removed Fake Data ---


const HomePage: React.FC<HomePageProps> = ({ posts, profileData, aboutMeContent, initials }) => {
    // Use a placeholder image or get from profileData if available
    const profileImageUrl = profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random`; // Example fallback

    return (
        <>
            {/* Header can remain in App.tsx or move here depending on preference */}
            <main className="flex-grow">
                <section className="profile-section flex flex-col items-center mb-12">
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

                <section className="about-me mb-12">
                    <Card>
                        <CardHeader>
                            {/* Use real name for title */}
                            <CardTitle>About {profileData.name}</CardTitle>
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