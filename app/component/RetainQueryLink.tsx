'use client';
import Link, { LinkProps } from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PropsWithChildren } from 'react';

export default function RetainQueryLink({ href, ...props }: LinkProps & PropsWithChildren) {
    const query = `?${useSearchParams().toString()}`;

    return (
        <Link
            {...props}
            href={href + query}
        />
    );
};