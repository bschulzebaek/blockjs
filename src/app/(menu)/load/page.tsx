'use client';
import { useEffect, useState } from 'react';
import WorldConfigStorage, { WorldConfig } from '@/core/storage/WorldConfigStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import styles from '@/styles/page/main-menu-load.module.scss';
import RetainQueryLink from '@/app/component/RetainQueryLink';

export default function LoadPage() {
    const [loading, setLoading] = useState(true);
    const [worlds, setWorlds] = useState<WorldConfig[]>([]);

    function deleteWorld(uuid: string) {
        WorldConfigStorage.delete(uuid).then(() => {
            setWorlds((worlds) => {
                return worlds.filter((world) => world.getUUID() !== uuid);
            });
        });
    }

    useEffect(() => {
        WorldConfigStorage.getAll().then((worlds) => {
            setWorlds(worlds);
            setLoading(false);
        });
    }, []);


    let items = [ loading ? <li key={'list-loading'}>Loading ...</li> : <li key={'no-world'}>No worlds found.</li>];

    if (worlds.length > 0) {
        items = worlds.map((world) => {
            const uuid = world.getUUID(),
                name = world.getName();

            return (
                <li key={uuid} className={styles.gameListItem}>
                    <RetainQueryLink href={`/game/${uuid}`}>
                        <button>
                            {name}
                        </button>
                    </RetainQueryLink>
                    <button onClick={() => deleteWorld(uuid)}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </li>
            );
        });
    }

    return (
        <>
            <h1>Load Game</h1>
            <ul>
                {items}
                <li className={'mt-4'}>
                    <RetainQueryLink href="/">
                        <button>
                            Back
                        </button>
                    </RetainQueryLink>
                </li>
            </ul>
        </>
    );
}