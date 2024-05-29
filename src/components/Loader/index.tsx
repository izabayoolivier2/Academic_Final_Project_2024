"use client"
import anime from 'animejs';
import { useEffect, useState } from 'react';

export default function Loader() {
    const [isVisible, setIsVisible] = useState(true);

    function doAnimation() {
        const loaderLineAnimation = anime.timeline({
            autoplay: true
        })

        loaderLineAnimation.add({
            targets: '.line-loader',
            width: '100%',
            duration: 1000,
            easing: 'easeInOutQuad'
        })
        loaderLineAnimation.add({
            targets: '.outer-line-loader',
            backgroundColor: '#CE181E',
            duration: 5,
        })

        loaderLineAnimation.add({
            targets: '.line-loader',
            width: 0,
            height: 0,
            duration: 5
        })

        loaderLineAnimation.add({
            targets: '.outer-line-loader',
            width: '100%',
            scaleY: {
                value: 0,
                delay: 500,
                duration: 1000
            },
            duration: 1000,
            easing: 'linear',
            complete: () => {
                anime({
                    targets: '.inline-lowerdiv',
                    translateY: '50vh',
                    easing: 'cubicBezier(.42, 0, 1, 1)',
                    duration: 1000,
                })

                anime({
                    targets: '.inline-upperdiv',
                    translateY: `-50vh`,
                    easing: 'cubicBezier(.42, 0, 1, 1)',
                    duration: 1000,
                    complete: () => {
                        // Enable scrolling after animations have finished
                        document.body.style.overflowY = 'auto';
                        setIsVisible(false);
                    }
                })
            }
        })
    }

    useEffect(() => {
        // Disable scrolling when component mounts
        document.body.style.overflowY = 'hidden';
        doAnimation();
    }, []);

    return (
        isVisible && (
            <div id='loader' className='h-screen w-screen absolute overflow-hidden'>
                <div className={`h-screen w-screen absolute flex flex-col items-center justify-center z-20`}>
                    <div className='outer-line-loader w-[15rem] lg:w-[20rem] bg-neutral-600 h-[1px] '>
                        <div className="line-loader float-left w-[1px] bg-[#CE181E] h-[1px]">
                        </div>
                    </div>
                </div>

                <div className='inline-upperdiv bg-black-100 h-1/2 w-full absolute top-0 z-10'></div>
                <div className='inline-lowerdiv bg-black-100 h-1/2 w-full absolute bottom-0 z-10'></div>
            </div>
        )
    )
}
