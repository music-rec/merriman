import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { MediaItem } from '../../../server/models';
import WatchStateManager from '../../managers/WatchStateManager';

export const VideoPlayer = (props: { media: MediaItem }) => {
  const [watchTime, setWatchTime] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);

  useLayoutEffect(() => {
    const effect = async () => {
      if (ref.current === null) return;
      const state = await WatchStateManager.getWatchState(
        props.media._id.toString()
      );
      if (state) {
        setWatchTime(state.time || 0);
        ref.current.currentTime = state.time;
      }
    };
    effect();
  }, []);

  const updateTime = async (time: number) => {
    if (time >= watchTime + 5) {
      setWatchTime(time);
      await WatchStateManager.setWatchTime(props.media._id.toString(), time);
    }
  };
  return props.media ? (
    <video
      className="video-player"
      id="video-player"
      controls
      src={`/api/media/play/${props.media._id.toString()}`}
      onTimeUpdate={(e) => updateTime(e.currentTarget.currentTime)}
      ref={ref}
    >
      {props.media && props.media.webvtt ? (
        <track
          label="English"
          kind="subtitles"
          srcLang="en"
          src={`/api/media/captions/${props.media._id.toString()}`}
          default
        />
      ) : null}
    </video>
  ) : null;
};