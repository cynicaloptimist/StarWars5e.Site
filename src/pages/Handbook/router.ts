import HandbookPage from './HandbookPage.vue'
import HandbookNavigation from './HandbookNavigation.vue'
import HandbookChapter from './HandbookChapter.vue'
import HandbookSpecies from './HandbookSpecies.vue'
import ReferenceSpeciesDetail from '@/pages/Reference/ReferenceSpeciesDetail.vue'
import HandbookClasses from './HandbookClasses.vue'
import HandbookClassesDetail from './HandbookClassesDetail.vue'
import HandbookCasting from './HandbookCasting.vue'
import HandbookBackgrounds from './HandbookBackgrounds.vue'
import HandbookCustomization from './HandbookCustomization.vue'

export default {
  path: '/handbook',
  components: {
    default: HandbookPage,
    navigation: HandbookNavigation
  },
  children: [
    {
      path: 'species',
      component: HandbookSpecies
    },
    {
      path: 'species/:speciesName',
      component: ReferenceSpeciesDetail,
      props: true
    },
    {
      path: 'classes',
      component: HandbookClasses
    },
    {
      path: 'casting',
      component: HandbookCasting
    },
    {
      path: 'backgrounds',
      component: HandbookBackgrounds
    },
    {
      path: 'classes/:className',
      component: HandbookClassesDetail,
      props: true
    },
    {
      path: 'customization',
      component: HandbookCustomization
    },
    {
      path: ':chapter',
      component: HandbookChapter,
      props: true
    },
    {
      path: '',
      component: HandbookChapter,
      props: {
        chapter: 'introduction'
      }
    }
  ]
}
