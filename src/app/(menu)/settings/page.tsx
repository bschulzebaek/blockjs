import RetainQueryLink from '@/app/component/RetainQueryLink';

export default function SettingsPage() {
    return (
        <>
            <h1>Settings</h1>
            <ul>
                <li>- not yet implemented -</li>
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