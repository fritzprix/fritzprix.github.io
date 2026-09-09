import { Post, ProfileData } from '@/App';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { SocialIcon } from 'react-social-icons';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';
import { MarkdownComponents } from '../components/MarkdownComponents';
import PostsSection from '../components/PostsSection';

interface HomePageProps {
    posts: Post[];
    profileData: ProfileData;
    aboutMeContent: string;
    initials: string;
}

function ProfileSection({ profileData, initials }: { profileData: ProfileData, initials: string }) {
    const profileImageUrl = profileData.profileImageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name)}&background=random`;

    return (
        <section className="profile-section flex flex-col items-center mb-12">
            <Avatar className="w-32 h-32 mb-4 ring-4 ring-primary/20">
                <AvatarImage src={profileImageUrl} alt={profileData.name} />
                <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold mb-2">{profileData.name}</h1>
            <p className="text-muted-foreground mb-3">{profileData.address}</p>
            <div className="flex space-x-4">
                {profileData.social.map((link) => (
                    <SocialIcon key={link.name} network={link.icon} className='w-6 h-6' url={link.url} />
                ))}
            </div>
        </section>
    )
}

const HomePage: React.FC<HomePageProps> = ({ posts, profileData, aboutMeContent, initials }) => {
    return (
        <>
            <main className="flex-grow">
                <ProfileSection profileData={profileData} initials={initials} />
                <section className="about-me mb-12">
                    <Card>
                        <CardHeader>
                        </CardHeader>
                        <CardContent>
                            <div className="text-justify">
                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm, remarkBreaks]}
                                    components={MarkdownComponents}
                                >
                                    {aboutMeContent}
                                </ReactMarkdown>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                <PostsSection posts={posts} />
            </main>
        </>
    );
};

export default HomePage;
