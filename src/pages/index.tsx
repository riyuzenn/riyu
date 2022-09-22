import { useMatomo } from '@m4tt72/matomo-tracker-react';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { History } from '../components/history';
import { Input } from '../components/input';
import { useShell } from '../utils/shellProvider';
import { useTheme } from '../utils/themeProvider';
import config from '../../config.json';

import { useKeyboardListNavigation } from 'use-keyboard-list-navigation';
import { useRouter } from 'next/router';
import data from '../lib/data';

interface IndexPageProps {
  inputRef: React.MutableRefObject<HTMLInputElement>;
}

type Type = {
  name: string;
  url: String;
};
const PBootloader = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10);
  const [stopTimer, setStopTimer] = useState(false);
  const { index, cursor, interactive, selected } = useKeyboardListNavigation({
    list: data,
    onEnter: () => {
      router.push(`${data[index].url}`);
    },
  });
  useEffect(() => {
    const params = new URLSearchParams(window?.location.search);
    window.addEventListener('keydown', (e) => {
      if (!params.get('ref')) {
        switch (e.key) {
          case 'n':
            router.push('https://n.riyuzenn.me');
          case 'c':
            router.push('https://riyuzenn.me/?ref=riyu');
        }
      }
    });
    if (timeLeft === 0) {
      setTimeLeft(0);
      router.push(`${data[index].url}`);
    }

    // exit early when we reach 0
    if (!timeLeft) return;

    // save intervalId to clear the interval when the
    // component re-renders
    const intervalId =
      index === 0
        ? setInterval(() => {
            setTimeLeft(timeLeft - 1);
          }, 1000)
        : setStopTimer(true);

    // clear interval on re-render to avoid memory leaks
    if (intervalId) return () => clearInterval(intervalId);

    // add timeLeft as a dependency to re-rerun the effect
    // when we update it
  }, [timeLeft]);

  return (
    <React.Fragment>
      <div className="flex min-h-screen ">
        <div className="flex flex-col space-y-10 items-center px-10 py-10 w-full">
          <div className="flex flex-col items-center">
            <h1 className="text-[#fff]">GNU GRUB version 2.02</h1>
            <p className="">
              Welcome to GNU Grub bootloader, please choose the specific
              environment to boot.
            </p>
            <p className={`${stopTimer ? 'invisible' : 'block'} pt-3`}>
              Booting in {timeLeft}s
            </p>
          </div>

          <div className="h-full w-[60%] border border-[#656565] px-2 py-5">
            <ul className="space-y-1">
              {data.map((value: Type, i: number) => {
                return (
                  <li>
                    <button
                      onClick={() => {
                        window.open(value.url.toString())
                      }}
                      className={`${
                        i === index ? 'bg-[#bebebe] text-[#121212]' : ''
                      }
                        w-full text-left
                      `}
                    >
                      {`${i === index ? '*' : ''}${value.name}`}
                    </button> 
                  </li>
                );
              })}
            </ul>
          </div>
          <h1 className="w-[50%]">
            Use the <span className="px-2">&uarr;</span>
            and <span className="px-2">&darr;</span> keys to select which entry
            is higlighted. Press enter to boot the selected environment, `n` to
            enter the normal mode (yuzu) or `c` for command-line (haruka).
          </h1>
        </div>
      </div>
    </React.Fragment>
  );
};

const IndexPage: React.FC<IndexPageProps> = ({ inputRef }) => {
  const { trackPageView } = useMatomo();
  const { history } = useShell();
  const { theme } = useTheme();
  const [a, b] = React.useState(false);

  const containerRef = React.useRef(null);

  React.useEffect(() => {
    trackPageView({});
  }, []);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [history]);

  React.useEffect(() => {
    const params = new URLSearchParams(window?.location.search);
    if (params.get('ref') === 'riyu') b(true);
  }, []);

  return (
    <React.Fragment>
      {a ? (
        <>
          <Head>
            <title>~</title>
          </Head>

          <div
            className="overflow-hidden h-full rounded"
            style={{
              borderColor: theme.brightBlack,
              padding: config.border ? 16 : 8,
              borderWidth: config.border ? 2 : 0,
            }}
          >
            <div ref={containerRef} className="overflow-y-auto h-full">
              <History history={history} />

              <Input inputRef={inputRef} containerRef={containerRef} />
            </div>
          </div>
        </>
      ) : (
        <PBootloader />
      )}
    </React.Fragment>
  );
};

export default IndexPage;
