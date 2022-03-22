import {
  GatsbyImage,
  IGatsbyImageData,
  getImageData
} from 'gatsby-plugin-image'
import React from 'react'

import Link from 'gatsby-theme-iterative-docs/src/components/Link'
import { pluralizeComments } from 'gatsby-theme-iterative-docs/src/utils/front/i18n'

import * as styles from './styles.module.css'
import SocialIcon, {
  ISocialIcon
} from 'gatsby-theme-iterative-docs/src/components/SocialIcon'

interface IBlogFeedMetaProps {
  avatar: {
    gatsbyImageData: IGatsbyImageData
  }
  commentsUrl?: string
  commentsCount?: number
  date: string
  name: string
  timeToRead: string
  links: Array<ISocialIcon>
}

const FeedMeta: React.FC<IBlogFeedMetaProps> = ({
  avatar,
  commentsUrl,
  commentsCount,
  date,
  name,
  timeToRead,
  links
}) => {
  return (
    <div className={styles.wrapper}>
      {avatar && (
        <GatsbyImage
          alt=""
          image={avatar.gatsbyImageData}
          className={styles.avatar}
        />
      )}
      <ul className={styles.list}>
        <li className={styles.segment}>{name}</li>
        {links && (
          <li className={styles.linkIcons}>
            {links.map(({ site, url }, i) => (
              <SocialIcon site={site} url={url} key={i} />
            ))}
          </li>
        )}

        <li className={styles.item}>
          {date} • {timeToRead} min read
        </li>
        {commentsUrl && typeof commentsCount === 'number' && (
          <li className={styles.item}>
            <Link href={commentsUrl} className={styles.link} target="_blank">
              {pluralizeComments(commentsCount)}
            </Link>
          </li>
        )}
      </ul>
    </div>
  )
}

export default FeedMeta
