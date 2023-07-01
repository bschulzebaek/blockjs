'use client';
import RetainQueryLink from '../../component/RetainQueryLink';
import { ChangeEvent, useEffect, useState } from 'react';
import SettingsStorage from '@/shared/settings/SettingsStorage';
import { DEFAULT_SETTINGS } from '@/shared/settings/default-settings';

export default function SettingsPage() {
    const [renderDistance, setRenderDistance] = useState(0);
    const [resolutionX, setResolutionX] = useState(0);
    const [resolutionY, setResolutionY] = useState(0);

    useEffect(() => {
        const settings = SettingsStorage.get();

        settings.setRenderDistance(renderDistance);
        settings.setResolutionX(resolutionX);
        settings.setResolutionY(resolutionY);

        SettingsStorage.save(settings);

    }, [ renderDistance, resolutionX, resolutionY ]);

    useEffect(() => {
        const settings = SettingsStorage.get();

        setRenderDistance(settings.getRenderDistance());
        setResolutionX(settings.getResolutionX());
        setResolutionY(settings.getResolutionY());
    }, []);

    function _setRenderDistance(event: ChangeEvent) {
        let value = parseInt((event.target as HTMLInputElement).value);

        if (isNaN(value)) {
            value = DEFAULT_SETTINGS.RENDER_DISTANCE;
        }

        setRenderDistance(value);
    }

    return (
        <>
            <h1>Settings</h1>
            <ul>
                <li>
                    <div className="input-group">
                        <label htmlFor="renderDistance" className={'label-name'}>Render distance</label>
                        <label htmlFor="renderDistance" className={'label-value'}>{renderDistance}</label>
                        <input
                            id={'renderDistance'}
                            type="range"
                            min={1}
                            max={12}
                            placeholder={'Render Distance'}
                            value={renderDistance}
                            onChange={(event) => _setRenderDistance(event)}
                        />
                    </div>
                </li>

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