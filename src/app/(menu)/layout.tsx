import '@/app/styles/index.scss';
import styles from '@/app/styles/layout/menu.module.scss';
import Image from 'next/image';

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
                src={'/interface/background.jpg'}
                alt="Main menu background image"
                width={1920}
                height={1080}
            />
        </div>

        <main className={styles.menuContent}>
            {children}
        </main>
        </body>
        </html>
    );
}
