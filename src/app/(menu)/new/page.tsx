'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import generateSeed from '@/utility/generate-seed';
import WorldConfigStorage from '@/core/storage/WorldConfigStorage';

const DEFAULT_NAME = `New World ${new Date().toISOString().substring(0, 10)}`;

export default function NewPage() {
    const router = useRouter();
    const [name, setName] = useState(DEFAULT_NAME);
    const [seed, setSeed] = useState(generateSeed());

    function createWorldConfig() {
        if (!name || !seed) {
            return;
        }

        WorldConfigStorage.create(name, seed).then((uuid) => {
            router.push(`/game/${uuid}`);
        });
    }

    return (
        <>
            <h1>Create World</h1>

            <ul>
                <li>
                    <input type="text" placeholder={'World Name'} defaultValue={name} onChange={(event) => setName(event.target.value)} />
                </li>
                <li>
                    <input type="text" placeholder={'World Seed'} defaultValue={seed} onChange={(event) => setSeed(event.target.value)} />
                </li>
                <li>
                    <Link href="/">
                        <button>
                            Back
                        </button>
                    </Link>

                    <button onClick={createWorldConfig}>
                        Confirm
                    </button>
                </li>
            </ul>
        </>
    );
}