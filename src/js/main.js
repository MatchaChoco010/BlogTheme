/* global gtag, gtagCode, hljs, Barba, twttr */

const SCROLL_TOP_THRESHOLD = 10
function scroll () {
  const isTopPage = document.location.pathname === '/'
  if (!isTopPage) return

  if (window.scrollY < SCROLL_TOP_THRESHOLD) {
    document.body.classList.add('top')
  } else {
    document.body.classList.remove('top')
  }
}
window.addEventListener('scroll', scroll, { passive: true })

function wait (millisecond) {
  return new Promise(resolve => {
    setTimeout(resolve, millisecond)
  })
}
const Transition = Barba.BaseTransition.extend({
  start: async function () {
    this.oldContainer.classList.add('fadeOut')

    await Promise.all([this.newContainerLoading, wait(500)])

    window.scrollTo(0, 0)

    if (document.location.pathname === '/') {
      document.body.classList.add('top')
    } else {
      document.body.classList.remove('top')
    }

    this.newContainer.classList.add('fadeIn')

    this.done()
  }
})
Barba.Pjax.getTransition = () => Transition
Barba.Dispatcher.on(
  'newPageReady',
  (currentStatus, prevStatus, HTMLElementContainer, newPageRawHTML) => {
    Array.from(document.querySelectorAll('.highlight'), figure => {
      const className = figure.className
      Array.from(figure.querySelectorAll('.code>pre'), block => {
        if (!className.includes('plain')) {
          block.className = className
        }
        hljs.highlightBlock(block)
      })
    })

    const head = document.head

    const newPageRawHead = newPageRawHTML.match(
      /<head[^>]*>([\s\S.]*)<\/head>/i
    )[0]
    const newPageHead = document.createElement('head')
    newPageHead.innerHTML = newPageRawHead

    const headTags = [
      "meta[name='keywords']",
      "meta[name='description']",
      "meta[property^='og']",
      "meta[name^='twitter']",
      'meta[itemprop]',
      'link[itemprop]',
      "link[rel='prev']",
      "link[rel='next']",
      "link[rel='canonical']",
      "link[rel='alternate']"
    ].join(',')

    const oldHeadTags = head.querySelectorAll(headTags)
    for (let i = 0; i < oldHeadTags.length; i++) {
      head.removeChild(oldHeadTags[i])
    }

    const newHeadTags = newPageHead.querySelectorAll(headTags)
    for (let i = 0; i < newHeadTags.length; i++) {
      head.appendChild(newHeadTags[i])
    }
  }
)
Barba.Dispatcher.on('initStateChange', () => {
  gtag('config', gtagCode, {
    page_title: document.title,
    page_path:
      window.location.pathname.replace(/^\/?/, '/') + window.location.search
  })
})
Barba.Dispatcher.on('newPageReady', () => {
  if (typeof twttr !== 'undefined') {
    twttr.widgets.load()
  }
})

document.addEventListener(
  'DOMContentLoaded',
  () => {
    Barba.Prefetch.init()
    Barba.Pjax.start()

    document.getElementById('blog-button').addEventListener('click', () => {
      window.scrollTo(0, 10)
      scroll()
    })
  },
  {
    once: true
  }
)
