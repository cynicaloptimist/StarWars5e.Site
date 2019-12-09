<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import CharacterBuilderSpecies from './CharacterBuilderSpecies.vue'
  import CharacterBuilderClass from './CharacterBuilderClass.vue'
  import CharacterBuilderAbilityScores from './CharacterBuilderAbilityScores.vue'
  import CharacterBuilderDescription from './CharacterBuilderDescription.vue'
  import CharacterBuilderEquipment from './CharacterBuilderEquipment.vue'
  import { RawCharacterType } from '@/types/rawCharacterTypes'
  import { CompleteCharacterType } from '@/types/completeCharacterTypes'
  import { SpeciesType, ClassType, PowerType, FeatType, BackgroundType, ArchetypeType } from '@/types/characterTypes'
  import { EquipmentType } from '@/types/lootTypes'
  import Loading from '@/components/Loading.vue'

  const characterModule = namespace('character')
  const classesModule = namespace('classes')
  const archetypesModule = namespace('archetypes')
  const speciesModule = namespace('species')
  const equipmentModule = namespace('equipment')
  const powersModule = namespace('powers')
  const featsModule = namespace('feats')
  const backgroundsModule = namespace('backgrounds')
  const characterAdvancementsModule = namespace('characterAdvancements')
  const skillsModule = namespace('skills')
  const conditionsModule = namespace('conditions')

@Component({
  components: {
      CharacterBuilderSpecies,
      CharacterBuilderClass,
      CharacterBuilderAbilityScores,
      CharacterBuilderDescription,
      CharacterBuilderEquipment,
      Loading
    }
  })
  export default class CharacterBuilder extends Vue {
    @characterModule.State character!: RawCharacterType
    @characterModule.Action createCharacter!: () => void
    @characterModule.Getter completeCharacter!: CompleteCharacterType
    @characterModule.Action updateCharacter!: (newCharacter: RawCharacterType) => void
    @characterModule.Action replaceCharacterProperty!: ({ path, property }: { path: string, property: any }) => void
    @characterModule.Action deleteCharacterProperty!: ({ path, index }: { path: string, index: number }) => void

    @classesModule.State classes!: ClassType[]
    @classesModule.Action fetchClasses!: () => void
    @archetypesModule.State archetypes!: ArchetypeType[]
    @archetypesModule.Action fetchArchetypes!: () => void
    @equipmentModule.State equipment!: EquipmentType[]
    @equipmentModule.Action fetchEquipment!: () => void
    @powersModule.State powers!: PowerType[]
    @powersModule.Action fetchPowers!: () => void
    @featsModule.State feats!: FeatType[]
    @featsModule.Action fetchFeats!: () => void
    @backgroundsModule.State backgrounds!: BackgroundType[]
    @backgroundsModule.Action fetchBackgrounds!: () => void
    @speciesModule.State species!: SpeciesType[]
    @speciesModule.Action fetchSpecies!: () => void
    @characterAdvancementsModule.Action fetchCharacterAdvancements!: () => void
    @skillsModule.Action fetchSkills!: () => void
    @conditionsModule.Action fetchConditions!: () => void

    currentStep = 0
    isReady = false

    created () {
      Promise.all([
        this.fetchClasses(),
        this.fetchArchetypes(),
        this.fetchEquipment(),
        this.fetchPowers(),
        this.fetchFeats(),
        this.fetchBackgrounds(),
        this.fetchSpecies(),
        this.fetchCharacterAdvancements(),
        this.fetchSkills(),
        this.fetchConditions()
      ])
        .then(this.createCharacter)
        .then(() => { this.isReady = true })
    }

    get steps () {
      return [ {},
        {
          name: 'Species',
          component: 'CharacterBuilderSpecies',
          props: {
            species: this.species,
            currentSpecies: this.character.species
          }
        },
        {
          name: 'Class',
          component: 'CharacterBuilderClass',
          props: {
            classes: this.classes,
            currentClasses: this.character.classes,
            isFixedHitPoints: this.character.isFixedHitPoints
          }
        },
        {
          name: 'Ability Scores',
          component: 'CharacterBuilderAbilityScores',
          props: {
            currentScores: this.character.baseAbilityScores
          }
        },
        {
          name: 'Description',
          component: 'CharacterBuilderDescription',
          props: {
            currentBackground: this.character.background,
            backgrounds: this.backgrounds
          }
        },
        { name: 'Equipment', component: 'CharacterBuilderEquipment' }
      ]
    }

    get numSteps () {
      return this.steps.length - 1
    }

    nextStep () {
      this.currentStep = Math.min(this.numSteps, this.currentStep + 1)
      window.scrollTo(0, 0)
    }

    prevStep () {
      this.currentStep = Math.max(this.currentStep - 1, 0)
      window.scrollTo(0, 0)
    }
  }
</script>

<template lang="pug">
  div
    h1.pb-3 Character Builder (BETA)
    div(v-if="currentStep === 0").d-flex.justify-center
      div(:class="$style.pageZero").text-left
        div This character builder is still in #[span.primary--text beta].
        | We are still working on lots of cool options and updates!
        | Here's a few things to be aware of:
        h2.mt-5 Features
        div.
          We have not yet implemented translating #[span.primary--text character features, species, features, feats, etc.]
          into code that the character sheet can use. Until that is done, you can enter them as
          #[span.primary--text custom features] by copying the text into your character sheet,
          and make any adjustments to numbers as #[span.primary--text tweaks in the Settings screen.]
        div.
          For example, it does not yet recognize that level 1 operatives gain expertise, so you cannot choose expertise
          skills or see the calculated values. However, in the settings page, you can give yourself a +2 bonus to skills
          you choose. Then you can add a custom feature for Sneak Attack, copying the description from the operative page
          on this site.
        h2.mt-5 Local Storage
        div The next big step is letting you create an account to store characters on our servers.
        div.
          Until then, you will have to save your character to a
          #[span.primary--text file on your computer],
          and upload it to this site whenever you want to view it.
        div #[span.primary--text Nothing is saved] unless you download the file, including tracking hit points, force points, etc.
        div.mt-5.
          Please report any bugs you find, or features you want to see, at the
          #[span.primary--text #website-character-builder]
          channel in our Discord server.
        div.mt-5.d-flex.flex-wrap.justify-space-around
          a(href="https://discord.gg/zYcPYTu", target="_blank").mb-5
            v-btn(light)
              v-icon(color="Discord").mr-3 fab fa-discord
              | Go to Discord Server
          v-btn(color="primary", @click="currentStep = 1") Go to character builder
    v-stepper(v-else-if="isReady", v-model="currentStep", alt-labels)
      v-stepper-header
        template(v-for="n in numSteps")
          v-stepper-step(:key="`${n}-step`", :complete="currentStep > n", :step="n", editable) {{ steps[n].name }}
          v-divider(v-if="n !== numSteps", :key="n", :class="$style.divider")
      v-stepper-items
        v-stepper-content(v-for="n in numSteps" :key="`${n}-content`" :step="n")
          component(
            :is="steps[n].component",
            v-bind="steps[n].props",
            v-on="{ updateCharacter, replaceCharacterProperty, deleteCharacterProperty }"
          )
          v-btn(v-if="currentStep < numSteps", color="primary", @click="nextStep") Continue
          v-btn(v-if="currentStep === numSteps", color="primary", to="characterSheet") Save and View My Character
          v-btn(v-if="currentStep > 0", text, @click="prevStep") Back
    Loading(v-else)
    div.mt-5 {{ character }}

</template>

<style module lang="scss">
  .divider {
    visibility: visible;
  }

  .pageZero {
    max-width: 700px;
  }
</style>

<style lang="scss">
  .v-stepper .v-stepper__step__step .v-icon {
    font-size: 12px;
  }
</style>