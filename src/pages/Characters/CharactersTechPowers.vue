<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import SearchTable from '@/components/SearchTable.vue'
  import { PowerType } from '@/types/characterTypes'
  import _ from 'lodash'
  import VueMarkdown from 'vue-markdown'
  import BackButton from '@/components/BackButton.vue'

  const powersModule = namespace('powers')

  @Component({
    components: {
      SearchTable,
      BackButton,
      VueMarkdown
    }
  })
  export default class CharactersForcePowers extends Vue {
    @powersModule.State powers!: PowerType[]
    @powersModule.Action fetchPowers!: () => void
    initialSearch: string | (string | null)[] = ''
    tableType: string = 'Tech Powers'

    created () {
      this.fetchPowers()
      this.initialSearch = this.$route.query.search
    }

    get items () {
      return _(this.powers)
        .filter(({ powerType }) => powerType === 'Tech')
        .map(power => ({
          ...power,
          id: power.name,
          isExpandable: power.description
        })).value()
    }

    get headers () {
      return [
        { text: 'Name', value: 'name' },
        {
          text: 'Level',
          value: 'level',
          render: (value: string) => value || 'At-will',
          isMultiSelect: true,
          filterChoices: ['At-will', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
          filterFunction: ({ level }: PowerType, filterValue: string[]) => _.includes(filterValue, (level || 'At-will').toString())
        },
        {
          text: 'Casting Period',
          value: 'castingPeriodText',
          isMultiSelect: true,
          filterChoices: ['1 action', '1 bonus action', '1 reaction', '1 hour', '8 hours', '1 minute', '10 minutes'],
          filterFunction: ({ castingPeriodText }: PowerType, filterValue: string[]) => _.some(filterValue, (filter: string) => _.includes(castingPeriodText, filter))
        },
        {
          text: 'Range',
          value: 'range',
          isMultiSelect: true,
          filterChoices: ['Varies', 'Self', 'Touch', '10 feet', '15 feet', '30 feet', '60 feet', '90 feet', '100 feet', '120 feet', '150 feet', '250 feet', '300 feet', '500 feet', 'Unlimited'],
          filterFunction: ({ range }: PowerType, filterValue: string[]) => _.some(filterValue, (filter: string) => range.includes(filter))
        },
        {
          text: 'Duration',
          value: 'duration',
          render: _.upperFirst,
          isMultiSelect: true,
          filterChoices: ['1 hour', '1 minute', '10 minutes', '24 hours', '8 hours', 'Instantaneous', 'Until dispelled'],
          filterFunction: ({ duration }: PowerType, filterValue: string[]) => _.some(filterValue, (filter: string) => _.includes(duration, filter))
        },
        {
          text: 'Concentration',
          value: 'concentration',
          render: (value: boolean) => value ? 'Concentration' : '-',
          filterChoices: ['No', 'Yes'],
          filterFunction: ({ concentration }: PowerType, filterValue: string) => {
            if (concentration && filterValue === 'Yes') return true
            if (!concentration && filterValue === 'No') return true
            return false
          }
        },
        {
          text: 'Source',
          value: 'contentSource',
          render: _.startCase,
          filterChoices: ['PHB', 'EC'],
          filterFunction: ({ contentSource }: PowerType, filterValue: string) => _.startCase(contentSource) === filterValue
        }
      ]
    }
  }
</script>

<template lang="pug">
  div
    BackButton
    h1 Tech Powers
    br
    SearchTable(name="TechPowers", v-bind="{ headers, items, initialSearch, tableType }")
      template(v-slot:default="props")
        VueMarkdown(:source="props.item.description")
</template>
