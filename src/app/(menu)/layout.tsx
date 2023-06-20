import '@/styles/index.scss';
import styles from '@/styles/layout/menu.module.scss';
import Image from 'next/image';
import backgroundImage from '@/assets/interface/background.jpg';

export const metadata = {
    title: 'BlockJS',
    description: 'BlockJS is yet another Minecraft clone built with JavaScript. See the About link for more details about this project.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body suppressHydrationWarning={true} >
        <div className={styles.menuBackground}>
            <Image
                src={backgroundImage}
                alt="Main menu background image"
            />
        </div>

        <main className={styles.menuContent}>
            {children}
        </main>
        </body>
        </html>
    );
}
