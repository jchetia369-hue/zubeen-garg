
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       ZUBEEN GARG MUSIC SYSTEM
       - 18 song players
       - 18 matching videos
       - Hear His Voice
       - Humming 1
       - Humming 2
       - Only one audio at a time
       - Matching video plays with song
       - Video stays muted
       - Audio/video stay synchronized
    ========================================================= */


    /* =========================================================
       1. SPECIAL AUDIO
    ========================================================= */

    const hisSongAudio =
        document.getElementById("hisSongAudio");

    const hearHisSongButton =
        document.getElementById("hearhisSongButton");

    const hummingAudio1 =
        document.getElementById("hummingAudio1");

    const hummingAudio2 =
        document.getElementById("hummingAudio2");

    const hummingButton1 =
        document.getElementById("hummingButton1");

    const hummingButton2 =
        document.getElementById("hummingButton2");


    /* =========================================================
       2. GET ALL SONG CARDS
       
       IMPORTANT:
       Instead of assuming:
       audio[0] = video[0]
       
       we find the audio and video INSIDE each card.
       
       This is much safer for all 18 cards.
    ========================================================= */

    const songCards =
        document.querySelectorAll(".song-card");


    console.log(
        "Song cards found:",
        songCards.length
    );


    /* =========================================================
       3. BUILD SONG PAIRS
    ========================================================= */

    const songPairs = [];


    songCards.forEach((card, index) => {

        const audio =
            card.querySelector(".song-player");

        const video =
            card.querySelector(".song-video");


        if (!audio) {

            console.error(
                `Song ${index + 1}: audio not found`,
                card
            );

            return;

        }


        if (!video) {

            console.error(
                `Song ${index + 1}: video not found`,
                card
            );

            return;

        }


        /* Video settings */

        video.muted = true;
        video.loop = true;
        video.playsInline = true;


        /* Store pair */

        songPairs.push({
            card: card,
            audio: audio,
            video: video,
            number: index + 1
        });


        console.log(
            `Song ${index + 1} connected successfully`
        );

    });


    console.log(
        "Connected song pairs:",
        songPairs.length
    );


    /* =========================================================
       4. STOP ALL SONGS
    ========================================================= */

    function stopAllSongAudio(except = null) {

        songPairs.forEach((pair) => {

            if (pair.audio !== except) {

                pair.audio.pause();

                pair.audio.currentTime = 0;

            }

        });

    }


    /* =========================================================
       5. STOP ALL SONG VIDEOS
    ========================================================= */

    function stopAllSongVideos(except = null) {

        songPairs.forEach((pair) => {

            if (pair.video !== except) {

                pair.video.pause();

                pair.video.currentTime = 0;

            }

        });

    }


    /* =========================================================
       6. STOP SPECIAL AUDIO
    ========================================================= */

    function stopSpecialAudio() {

        if (hisSongAudio) {

            hisSongAudio.pause();
            hisSongAudio.currentTime = 0;

        }


        if (hummingAudio1) {

            hummingAudio1.pause();
            hummingAudio1.currentTime = 0;

        }


        if (hummingAudio2) {

            hummingAudio2.pause();
            hummingAudio2.currentTime = 0;

        }

    }


    /* =========================================================
       7. RESET SPECIAL BUTTONS
    ========================================================= */

    function resetSpecialButtons() {

        if (hearHisSongButton) {

            hearHisSongButton.textContent =
                "▶ Hear His Voice";

        }


        if (hummingButton1) {

            hummingButton1.textContent =
                "▶ Play Humming 1";

        }


        if (hummingButton2) {

            hummingButton2.textContent =
                "▶ Play Humming 2";

        }

    }


    /* =========================================================
       8. STOP EVERYTHING
    ========================================================= */

    function stopEverything() {

        stopAllSongAudio();

        stopAllSongVideos();

        stopSpecialAudio();

        resetSpecialButtons();

    }


    /* =========================================================
       9. PLAY MATCHING VIDEO
    ========================================================= */

    function playMatchingVideo(pair) {

        if (!pair || !pair.video) {

            return;

        }


        const video = pair.video;
        const audio = pair.audio;


        /* Always mute video */

        video.muted = true;


        /*
           Synchronize before playing.
        */

        try {

            video.currentTime =
                audio.currentTime;

        } catch (error) {

            console.log(
                "Video time could not be set."
            );

        }


        /*
           Play video.
        */

        const playPromise =
            video.play();


        if (
            playPromise !== undefined
        ) {

            playPromise
                .then(() => {

                    console.log(
                        `Video ${pair.number} playing`
                    );

                })
                .catch((error) => {

                    console.error(
                        `Video ${pair.number} could not play:`,
                        error
                    );

                });

        }

    }


    /* =========================================================
       10. PAUSE MATCHING VIDEO
    ========================================================= */

    function pauseMatchingVideo(pair) {

        if (!pair || !pair.video) {

            return;

        }


        pair.video.pause();

    }


    /* =========================================================
       11. SETUP EACH SONG
    ========================================================= */

    songPairs.forEach((pair) => {

        const audio = pair.audio;
        const video = pair.video;


        /* =====================================================
           SONG PLAY
        ===================================================== */

        audio.addEventListener(
            "play",
            () => {

                console.log(
                    `Song ${pair.number} PLAY`
                );


                /*
                   Stop every other song.
                */

                stopAllSongAudio(audio);


                /*
                   Stop every other video.
                */

                stopAllSongVideos(video);


                /*
                   Stop special audio.
                */

                stopSpecialAudio();


                /*
                   Reset special buttons.
                */

                resetSpecialButtons();


                /*
                   Play matching video.
                */

                playMatchingVideo(pair);

            }
        );


        /* =====================================================
           SONG PAUSE
        ===================================================== */

        audio.addEventListener(
            "pause",
            () => {

                /*
                   Only pause this song's video.
                */

                pauseMatchingVideo(pair);

            }
        );


        /* =====================================================
           SONG ENDED
        ===================================================== */

        audio.addEventListener(
            "ended",
            () => {

                console.log(
                    `Song ${pair.number} ENDED`
                );


                video.pause();

                video.currentTime = 0;

            }
        );


        /* =====================================================
           AUDIO SEEK
        ===================================================== */

        audio.addEventListener(
            "seeking",
            () => {

                if (!video) return;


                /*
                   Keep video at the same position.
                */

                if (
                    Number.isFinite(
                        audio.currentTime
                    )
                ) {

                    try {

                        video.currentTime =
                            audio.currentTime;

                    } catch (error) {

                        console.log(
                            "Seek synchronization error."
                        );

                    }

                }

            }
        );


        /* =====================================================
           AUDIO TIME UPDATE
        ===================================================== */

        audio.addEventListener(
            "timeupdate",
            () => {

                /*
                   Only synchronize while
                   audio is actually playing.
                */

                if (audio.paused) {

                    return;

                }


                if (!video) {

                    return;

                }


                const difference =
                    Math.abs(
                        video.currentTime -
                        audio.currentTime
                    );


                /*
                   Correct only when there is
                   a noticeable difference.
                */

                if (difference > 0.30) {

                    try {

                        video.currentTime =
                            audio.currentTime;

                    } catch (error) {

                        console.log(
                            "Sync correction failed."
                        );

                    }

                }

            }
        );


        /* =====================================================
           VIDEO CLICK
           
           Clicking the video starts its song.
        ===================================================== */

        video.addEventListener(
            "click",
            () => {

                if (!audio.paused) {

                    audio.pause();

                    return;

                }


                /*
                   Start this song.
                */

                audio.play()
                    .catch((error) => {

                        console.error(
                            `Song ${pair.number} could not play:`,
                            error
                        );

                    });

            }
        );


        /* =====================================================
           VIDEO SETTINGS
        ===================================================== */

        video.muted = true;

        video.loop = true;

        video.playsInline = true;


        /*
           Do NOT autoplay videos.
           They start only when the song starts.
        */

        video.pause();

    });


    /* =========================================================
       12. HEAR HIS VOICE
    ========================================================= */

    if (
        hearHisSongButton &&
        hisSongAudio
    ) {

        hearHisSongButton.addEventListener(
            "click",
            () => {

                /*
                   If already playing → STOP
                */

                if (!hisSongAudio.paused) {

                    hisSongAudio.pause();

                    hisSongAudio.currentTime = 0;

                    hearHisSongButton.textContent =
                        "▶ Hear His Voice";

                    return;

                }


                /*
                   Stop songs and videos.
                */

                stopAllSongAudio();

                stopAllSongVideos();


                /*
                   Stop humming.
                */

                if (hummingAudio1) {

                    hummingAudio1.pause();
                    hummingAudio1.currentTime = 0;

                }


                if (hummingAudio2) {

                    hummingAudio2.pause();
                    hummingAudio2.currentTime = 0;

                }


                /*
                   Reset humming buttons.
                */

                if (hummingButton1) {

                    hummingButton1.textContent =
                        "▶ Play Humming 1";

                }


                if (hummingButton2) {

                    hummingButton2.textContent =
                        "▶ Play Humming 2";

                }


                /*
                   Play voice.
                */

                hisSongAudio.play()
                    .then(() => {

                        hearHisSongButton.textContent =
                            "⏹ Stop His Voice";

                    })
                    .catch((error) => {

                        console.error(
                            "His voice error:",
                            error
                        );

                    });

            }
        );


        hisSongAudio.addEventListener(
            "ended",
            () => {

                hearHisSongButton.textContent =
                    "▶ Hear His Voice";

            }
        );

    }


    /* =========================================================
       13. HUMMING 1
    ========================================================= */

    if (
        hummingButton1 &&
        hummingAudio1
    ) {

        hummingButton1.addEventListener(
            "click",
            () => {

                /*
                   If playing → STOP.
                */

                if (!hummingAudio1.paused) {

                    hummingAudio1.pause();

                    hummingAudio1.currentTime = 0;

                    hummingButton1.textContent =
                        "▶ Play Humming 1";

                    return;

                }


                /*
                   Stop everything else.
                */

                stopAllSongAudio();

                stopAllSongVideos();


                if (hisSongAudio) {

                    hisSongAudio.pause();
                    hisSongAudio.currentTime = 0;

                }


                if (hummingAudio2) {

                    hummingAudio2.pause();
                    hummingAudio2.currentTime = 0;

                }


                /*
                   Reset buttons.
                */

                if (hearHisSongButton) {

                    hearHisSongButton.textContent =
                        "▶ Hear His Voice";

                }


                if (hummingButton2) {

                    hummingButton2.textContent =
                        "▶ Play Humming 2";

                }


                /*
                   Play humming.
                */

                hummingAudio1.play()
                    .then(() => {

                        hummingButton1.textContent =
                            "⏹ Stop Humming 1";

                    })
                    .catch((error) => {

                        console.error(
                            "Humming 1 error:",
                            error
                        );

                    });

            }
        );


        hummingAudio1.addEventListener(
            "ended",
            () => {

                hummingButton1.textContent =
                    "▶ Play Humming 1";

            }
        );

    }


    /* =========================================================
       14. HUMMING 2
    ========================================================= */

    if (
        hummingButton2 &&
        hummingAudio2
    ) {

        hummingButton2.addEventListener(
            "click",
            () => {

                /*
                   If playing → STOP.
                */

                if (!hummingAudio2.paused) {

                    hummingAudio2.pause();

                    hummingAudio2.currentTime = 0;

                    hummingButton2.textContent =
                        "▶ Play Humming 2";

                    return;

                }


                /*
                   Stop everything else.
                */

                stopAllSongAudio();

                stopAllSongVideos();


                if (hisSongAudio) {

                    hisSongAudio.pause();
                    hisSongAudio.currentTime = 0;

                }


                if (hummingAudio1) {

                    hummingAudio1.pause();
                    hummingAudio1.currentTime = 0;

                }


                /*
                   Reset buttons.
                */

                if (hearHisSongButton) {

                    hearHisSongButton.textContent =
                        "▶ Hear His Voice";

                }


                if (hummingButton1) {

                    hummingButton1.textContent =
                        "▶ Play Humming 1";

                }


                /*
                   Play humming 2.
                */

                hummingAudio2.play()
                    .then(() => {

                        hummingButton2.textContent =
                            "⏹ Stop Humming 2";

                    })
                    .catch((error) => {

                        console.error(
                            "Humming 2 error:",
                            error
                        );

                    });

            }
        );


        hummingAudio2.addEventListener(
            "ended",
            () => {

                hummingButton2.textContent =
                    "▶ Play Humming 2";

            }
        );

    }


    /* =========================================================
       15. NEVER ALLOW VIDEO AUDIO
    ========================================================= */

    songPairs.forEach((pair) => {

        pair.video.muted = true;


        pair.video.addEventListener(
            "volumechange",
            () => {

                if (!pair.video.muted) {

                    pair.video.muted = true;

                }

            }
        );

    });


    /* =========================================================
       16. ERROR REPORTING
       
       This is especially useful for Song 16/17/18.
    ========================================================= */

    songPairs.forEach((pair) => {

        pair.audio.addEventListener(
            "error",
            () => {

                console.error(
                    `AUDIO ERROR - Song ${pair.number}`,
                    pair.audio.error
                );

            }
        );


        pair.video.addEventListener(
            "error",
            () => {

                console.error(
                    `VIDEO ERROR - Song ${pair.number}`,
                    pair.video.error
                );

            }
        );

    });


    /* =========================================================
       17. FINAL STATUS
    ========================================================= */

    console.log(
        "================================"
    );

    console.log(
        "ZUBEEN MUSIC SYSTEM READY"
    );

    console.log(
        `Total cards: ${songCards.length}`
    );

    console.log(
        `Connected pairs: ${songPairs.length}`
    );

    console.log(
        "================================"
    );

});

