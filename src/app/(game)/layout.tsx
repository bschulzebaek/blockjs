import '@/app/styles/index.scss';
import styles from '@/app/styles/layout/game.module.scss';

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
        <div className={styles.gameLayout}>
            <div className={styles.canvasWrapper}>
                <canvas className={styles.gameLayoutCanvas}></canvas>
            </div>
            <div className={styles.gameLayoutAdditional}>
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}