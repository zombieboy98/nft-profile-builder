import { Nft } from '../model/Nft';
import { ITheme } from '../model/Theme';
import domtoimage from 'dom-to-image';
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRefresh } from '@fortawesome/free-solid-svg-icons';
import AvatarImage from './AvatarImage';
import styles from './Canvas.module.scss';
import BackgroundSelector from './BackgroundSelector';
import StickerImage from './StickerImage';

type Props = {
  data: Nft[];
  theme: ITheme;
  onAvatarClick?: (index: number) => void;
  onDownload?: (src: string) => void;
};

export default function Canvas({
  data,
  theme,
  onAvatarClick,
  onDownload,
}: Props) {
  const [downloading, setDownloading] = useState(false);

  const [customBackground, setCustomBackground] = useState({});

  useEffect(() => {
    if (downloading) {
      domtoimage
        .toPng(document.querySelector('#capture'), { width: 1450 })
        .then(function (dataUrl) {
          var img = new Image();
          img.src = dataUrl;
          downloadURI(dataUrl, `${theme.name}.png`);
          onDownload(dataUrl);
          setDownloading(false);
        })
        .catch(function (error) {
          console.error('oops, something went wrong!', error);
          setDownloading(false);
        });
    }
  }, [downloading]);

  function downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function setBackground(style: any) {
    setCustomBackground(style);
  }

  return (
    <>
      <div className={`container ${downloading ? 'printing' : ''}`}>
        <div>
          <BackgroundSelector onChange={setBackground} />
        </div>
        <div className={`main-wrapper ${theme?.classNames} `}>
          <div
            id='capture'
            style={customBackground}
            className={`backdrop ${theme?.backdrop?.classNames ?? ''}`}
          >
            {!theme || !theme.bgStickers || theme.bgStickers.length === 0
              ? ''
              : theme.bgStickers.map((item, index) => (
                  <StickerImage
                    key={index}
                    src={item.src}
                    index={index}
                    classNames={item.classNames}
                    shape={item.shape}
                    onStickerClick={() => {}}
                  />
                ))}
            {!theme || theme.nfts.length === 0
              ? ''
              : theme.nfts.map((item, index) => (
                  <AvatarImage
                    key={index + data[index].id}
                    data={data}
                    index={index}
                    classNames={item.classNames}
                    shape={item.shape}
                    onAvatarClick={onAvatarClick}
                  />
                ))}
            {!theme || !theme.fgStickers || theme.fgStickers.length === 0
              ? ''
              : theme.fgStickers.map((item, index) => (
                  <StickerImage
                    key={index}
                    src={item.src}
                    index={index}
                    classNames={item.classNames + ' stamp'}
                    shape={item.shape}
                    onStickerClick={() => {}}
                  />
                ))}
          </div>
        </div>

        <div className='canvas-buttons'>
          <button className='button' onClick={() => setBackground({})}>
            <FontAwesomeIcon icon={faRefresh} /> Default
          </button>

          <button
            disabled={downloading ? true : false}
            className='button'
            onClick={() => setDownloading(true)}
          >
            <FontAwesomeIcon icon={faDownload} /> Download
          </button>
        </div>
      </div>
    </>
  );
}