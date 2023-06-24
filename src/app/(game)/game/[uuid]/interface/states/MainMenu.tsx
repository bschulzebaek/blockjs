import styles from '@/styles/component/main-menu.module.scss';
import ViewTransitions from '@/app/(game)/game/[uuid]/interface/ViewTransitions';
import Fullscreen from '@/app/(game)/game/[uuid]/interface/utility/Fullscreen';

export default function StateMainMenu() {
    return (
        <>
            <div className={'backdrop backdrop-7'}></div>
            <div className={'center-absolute ' + styles.menuContent}>
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
        </>
    );
}