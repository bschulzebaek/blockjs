import styles from '@/interface/views/main-menu/main-menu.module.scss';
import ViewTransitions from '../../ViewTransitions';
import Fullscreen from '../../utility/Fullscreen';

export default function MainMenuView() {
    return (
        <>
            <div className={'backdrop backdrop-7'}></div>
            <div className={'center-absolute ' + styles.container}>
                <h1>Pause</h1>

                <ul>
                    <li>
                        <button onClick={ViewTransitions.to_Teardown}>
                            Quit to Main Menu
                        </button>
                    </li>
                    <li>
                        <button onClick={Fullscreen.exit}>
                            Exit Fullscreen
                        </button>
                    </li>

                    <li className={'mt-4'}>
                        <button onClick={ViewTransitions.to_Default}>Resume</button>
                    </li>
                </ul>
            </div>
            <div className={styles.controls}>
                <h3>Controls</h3>

                <ul>
                    <li>Move: W,A,S,D</li>
                    <li>Up: Space</li>
                    <li>Down: Shift</li>
                    <li>Inventory: E</li>
                    <li>Select Item: 1-9 | Scroll</li>
                </ul>
            </div>
        </>
    );
}