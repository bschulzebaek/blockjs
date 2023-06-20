import Link from 'next/link';

export default function SettingsPage() {
    return (
        <>
            <h1>Settings</h1>
            <ul>
                <li>- not yet implemented -</li>
                <li className={'mt-4'}>
                    <Link href="/">
                        <button>
                            Back
                        </button>
                    </Link>
                </li>
            </ul>
        </>
    );
}