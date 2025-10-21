import { R } from '@praha/byethrow';
import Image from 'next/image';
import { PopulationCompositionForm } from '../features/population-composition/components/population-composition-form';
import { getPrefectures } from '../features/prefecture/fetchers';
import { fromResponse } from '../features/prefecture/models';

export default async function Home() {
  const prefectures = await R.pipe(
    R.do(),
    R.andThen(getPrefectures),
    R.andThen(fromResponse),
  );

  if (R.isFailure(prefectures)) {
    return <div>Failed to load prefectures</div>;
  }

  return (
    <div>
      <main>
        <PopulationCompositionForm prefectures={prefectures.value} />
      </main>
      <footer>
        <a
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="File icon"
            aria-hidden
            height={16}
            src="/file.svg"
            width={16}
          />
          Learn
        </a>
        <a
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="Window icon"
            aria-hidden
            height={16}
            src="/window.svg"
            width={16}
          />
          Examples
        </a>
        <a
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="Globe icon"
            aria-hidden
            height={16}
            src="/globe.svg"
            width={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
