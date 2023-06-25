import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/styles/page/main-menu.module.scss';
import RetainQueryLink from '@/app/component/RetainQueryLink';

export default function MenuPage() {
    return (
        <>
            <div className={styles.mainMenuLogo}>
                <Image
                    src={'/interface/logo.png'}
                    alt=">BlockJS logo"
                    width={395}
                    height={78}
                />
                <span className={styles.mainMenuLabel}>
                    Minecraft in JavaScript!
                </span>
            </div>
            <ul>
                <li>
                    <RetainQueryLink href="/new">
                        <button>
                            New Game
                        </button>
                    </RetainQueryLink>
                </li>
                <li>
                    <RetainQueryLink href="/load">
                        <button>
                            Load Game
                        </button>
                    </RetainQueryLink>
                </li>
                <li>
                    <RetainQueryLink href="/settings">
                        <button>
                            Settings
                        </button>
                    </RetainQueryLink>
                </li>
                <li>
                    <Link href="https://github.com/bschulzebaek/blockjs" target={'_blank'}>
                        <button>
                            About
                        </button>
                    </Link>

                    <button disabled={true}>
                        Exit Fullscreen
                    </button>
                </li>
            </ul>

            <div className={styles.mainMenuLegal}>
                This project is not affiliated with (or supported by) Mojang AB, Minecraft, or Microsoft in any way.

                <br />

                Any assets from Minecraft are used non-commercially under fair use and in accordance with <a cross-origin="anonymous" href="https://account.mojang.com/documents/minecraft_eula" target="_blank" rel="noopener"> Minecraft's EULA. </a>
            </div>
        </>
    );
}