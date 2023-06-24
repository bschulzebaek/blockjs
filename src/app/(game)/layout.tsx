import '@/styles/index.scss';
import styles from '@/styles/layout/game.module.scss';

export const metadata = {
    title: 'BlockJS',
    description: 'BlockJS is yet another Minecraft clone built with JavaScript. See the About link for more details about this project.',
};

export default function GameLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body suppressHydrationWarning={true} >
        <canvas className={styles.gameLayoutCanvas}></canvas>
        <div className={styles.gameLayoutAdditional}>
            {children}
        </div>
        </body>
        </html>
    );
}