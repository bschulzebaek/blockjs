import ViewTransitions from '@/app/(game)/[uuid]/interface/ViewTransitions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import styles from '@/app/styles/component/ready.module.scss';

export default function StateReady() {
    return (
        <>
            <div className={'backdrop ' + styles.readyBackdrop}></div>

            <div className={styles.content + ' center-absolute'}>
                <h2>Your world is ready</h2>

                <div className={styles.playButton + ' text-center'}>
                    <FontAwesomeIcon icon={ faPlay } onClick={ViewTransitions.to_Default} />
                </div>
            </div>
        </>
    );
}