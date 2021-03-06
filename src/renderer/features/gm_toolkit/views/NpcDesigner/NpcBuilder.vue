<template>
  <v-card :class="`role--${npc.npcClass.role}--text npc-builder`">
    <!-- Header -->
    <v-card-title class="white--text d-flex" :class="roleColor" style="min-height: 70px;">
      <v-container fluid style="padding: 0 16px">
        <v-layout
          align-center
          grow-shrink-0
          wrap
          :class="{
            column: $vuetify.breakpoint.xsOnly,
            'justify-center': $vuetify.breakpoint.xsOnly,
          }"
        >
          <v-fade-transition leave-absolute>
            <v-layout align-center v-if="!editingName" class="name" key="name">
              <v-flex headline shrink>{{ npc.name }}</v-flex>
              <v-flex shrink>
                <v-btn flat dark class="my-0 mx-1 px-2" style="min-width: 0;" @click="editName">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
            <v-flex v-else key="editname">
              <v-text-field
                ref="namefield"
                required
                dark
                color="white"
                v-model="newName"
                @blur="submitName"
                @keyup.enter="$refs.namefield.blur"
                class="mx-0 my-0"
              ></v-text-field>
            </v-flex>
          </v-fade-transition>
          <v-flex
            xs12
            sm2
            :class="{
              'mx-0': $vuetify.breakpoint.xsOnly,
              'ml-auto': $vuetify.breakpoint.smAndUp,
              'mr-2': $vuetify.breakpoint.smAndUp,
            }"
          >
            <v-btn-toggle v-model="npc.tier" mandatory @change="npc.setTierStats()">
              <v-btn flat>
                <v-icon :color="roleColor">mdi-numeric-1-box</v-icon>
              </v-btn>
              <v-btn flat>
                <v-icon :color="roleColor">mdi-numeric-2-box</v-icon>
              </v-btn>
              <v-btn flat>
                <v-icon :color="roleColor">mdi-numeric-3-box</v-icon>
              </v-btn>
            </v-btn-toggle>
          </v-flex>
          <v-flex subheading shrink>
            <div class="text-uppercase">{{ npc.npcClass.name }}</div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-title>
    <v-card-text class="px-4">
      <!-- Stats -->
      <v-flex align-center v-if="!editingStats">
        <v-btn :color="roleColor" class="ml-auto white--text" @click="editStats">EDIT STATS</v-btn>
      </v-flex>
      <v-flex align-center v-else>
        <v-btn :color="roleColor" class="ml-auto white--text" @click="submitStats">SUBMIT STATS</v-btn>
      </v-flex>
      <v-layout wrap justify-space-around class="statblock">
        <v-flex xs6 sm2 lg1 v-for="stat in Object.keys(stats)" :key="stat">
          <div class="label">{{ stat }}</div>
          <!--
          <div class="headline font-weight-bold primary--text">{{ stats[stat] }}</div>
          -->
          <div
            v-if="!editingStats"
            class="headline font-weight-bold primary--text"
          >{{ stats[stat] }}</div>
          <v-text-field v-else v-model="stats[stat]" type="number" solo :color="roleColor"></v-text-field>
        </v-flex>
        <v-flex xs6 sm2 lg1>
          <div class="label">SIZE</div>
          <div class="headline font-weight-bold primary--text">
            <v-select
              v-if="npc.npcClass.size.length > 1"
              :items="npc.npcClass.size"
              v-model="npc.size"
              :color="roleColor"
            />
            <div v-else class="headline font-weight-bold primary--text">{{ npc.size }}</div>
          </div>
        </v-flex>
      </v-layout>
      <v-divider class="my-3" />
      <!-- HASE -->
      <v-layout wrap justify-center class="statblock">
        <v-flex xs6 sm2 lg1 v-for="check in Object.keys(hase)" :key="check">
          <div class="label text-uppercase">{{ check }}</div>
          <div
            v-if="!editingStats"
            class="headline font-weight-bold primary--text"
          >{{ hase[check] > -1 ? '+' : '' }}{{ hase[check] }}</div>
          <v-text-field v-else v-model="hase[check]" type="number" solo :color="roleColor"></v-text-field>
        </v-flex>
      </v-layout>
      <v-divider class="my-3" />
      <!-- Notes -->
      <v-text-field outline label="Notes" v-model="npc.notes" :color="roleColor"></v-text-field>
      <v-divider class="mt-2 mb-3" />
      <!-- Systems header -->
      <v-layout grow-shrink-0>
        <v-flex class="title mb-2 text-xs-left grey--text text--darken-1">Systems</v-flex>
        <v-flex ml-auto>
          <v-checkbox :color="roleColor" v-model="systemsUnlocked" label="Unlock all systems" />
        </v-flex>
      </v-layout>
      <!-- Systems picker -->
      <v-layout wrap>
        <v-flex xs12 sm6>
          <v-card class="picker-card">
            <v-container>
              <v-fade-transition group tag="div" class="layout justify-start grow-shrink-0 wrap">
                <system-button
                  v-for="system in mySystems"
                  :key="system.name"
                  :system="system"
                  :closable="
                    !system.base ||
                      // make it also closable if it's a base system from another class
                      ![npc.npcClass.name, 'generic', ...npc._templates].includes(system.class)
                  "
                  @close="npc.removeSystem(system)"
                />
              </v-fade-transition>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex xs12 sm6>
          <v-card class="picker-card">
            <v-tabs dark color="primary" slider-color="secondary">
              <v-tab
                v-for="cat in Object.keys(systemsAvailable)"
                :key="cat"
                ripple
                centered
                mandatory
              >{{ cat }}</v-tab>
              <v-tab-item v-for="cat in Object.keys(systemsAvailable)" :key="cat">
                <v-container fluid>
                  <v-fade-transition
                    group
                    tag="div"
                    class="layout justify-start grow-shrink-0 wrap"
                  >
                    <system-button
                      v-for="system in systemsAvailable[cat]"
                      :key="system.name"
                      :system="system"
                      :addable="true"
                      @add="npc.pickSystem(system)"
                    />
                  </v-fade-transition>
                </v-container>
              </v-tab-item>
            </v-tabs>
          </v-card>
        </v-flex>
      </v-layout>
      <!-- Templates header -->
      <v-divider class="my-3" />
      <v-layout grow-shrink-0>
        <v-flex class="title mb-2 text-xs-left grey--text text--darken-1">Templates</v-flex>
      </v-layout>
      <!-- Templates picker -->
      <v-layout>
        <v-flex xs6>
          <v-card class="picker-card">
            <v-container>
              <v-fade-transition group tag="div" class="layout justify-start grow-shrink-0 wrap">
                <template-button
                  v-for="template in npc.templates"
                  :key="template.name"
                  :template="template"
                  :closable="!template.base"
                  @close="npc.removeTemplate(template.name)"
                />
              </v-fade-transition>
            </v-container>
          </v-card>
        </v-flex>
        <v-flex xs6>
          <v-card class="picker-card">
            <v-container fluid>
              <v-fade-transition group tag="div" class="layout justify-start grow-shrink-0 wrap">
                <template-button
                  v-for="template in npc.availableTemplates"
                  :key="template.name"
                  :template="template"
                  :addable="true"
                  @add="npc.addTemplate(template.name)"
                  :disabled="npc.templateIsIncompatible(template.name)"
                />
              </v-fade-transition>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-card-text>
    <v-divider class="my-1" />
    <v-card-actions class="mb-1 mr-2">
      <v-btn flat :color="roleColor" class="ml-auto" @click="$router.push('/npc-designer/')">Done</v-btn>
    </v-card-actions>
    <GoblinChan v-if="npc && tips.length" :tips="tips" key="goblinchan" />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
// components
import SystemButton from '../../components/NpcDesigner/SystemButton.vue'
import TemplateButton from '../../components/NpcDesigner/TemplateButton.vue'
import GoblinChan from '../../components/NpcDesigner/GoblinChan.vue'
// vuex
import { mapState } from 'vuex'

import NPC from '../../logic/NPC'
import NPCStats from '../../logic/NPCStats'
import { Dictionary } from 'vue-router/types/router'
import { NPCSystem } from '../../logic/interfaces/NPCSystem'
import { NPCTips } from '../../logic/Tips'

export default Vue.extend({
  name: 'npc-builder',
  components: { SystemButton, TemplateButton, GoblinChan },
  props: { preNpc: { type: NPC, required: true } },
  data: function() {
    return {
      editingName: false,
      editingStats: false,
      newName: '',
      npc: _.clone(this.preNpc),
      systemsUnlocked: false,

      HP: 0,
      HEAT: 0,
      STRUCTURE: 0,
      STRESS: 0,
      ARMOR: 0,
      SPEED: 0,
      EVADE: 0,
      EDEF: 0,
      SENSE: 0,
      SAVE: 0,
    }
  },
  computed: {
    tips(): object[] {
      return NPCTips(this.npc)
    },

    statMap() {
      let obj: { [key: string]: string } = {
        HP: 'hp',
        HEAT: 'heatcap',
        STRUCTURE: 'structure',
        STRESS: 'stress',
        ARMOR: 'armor',
        SPEED: 'speed',
        EVADE: 'evade',
        EDEF: 'edef',
        SENSE: 'sensor',
        SAVE: 'save',
        HULL: 'hull',
        AGILITY: 'agility',
        SYSTEMS: 'systems',
        ENGINEERING: 'engineering',
      }
      return _.pickBy(obj, o => o !== null)
    },

    stats() {
      const npcst = (this.npc as NPC).stats
      let obj: { [key: string]: number | null } = {
        HP: npcst.hp,
        HEAT: npcst.heatcap,
        STRUCTURE: npcst.structure > 1 ? npcst.structure : null,
        STRESS: npcst.stress > 1 ? npcst.stress : null,
        ARMOR: npcst.armor,
        SPEED: npcst.speed,
        EVADE: npcst.evade,
        EDEF: npcst.edef,
        SENSE: npcst.sensor,
        SAVE: npcst.save,
      }
      return _.pickBy(obj, o => o !== null)
    },

    hase() {
      const npcst = (this.npc as NPC).stats
      let obj: { [key: string]: number } = {
        HULL: npcst.hull,
        AGILITY: npcst.agility,
        SYSTEMS: npcst.systems,
        ENGINEERING: npcst.engineering,
      }
      return _.pickBy(obj, o => o !== null)
    },

    systemsAvailable(): { [key: string]: NPCSystem.Any[] } {
      const { npc } = this
      const preSort = NPC.allSystems.filter(system => {
        return (
          !npc.systems.includes(system) &&
          (this.systemsUnlocked ||
            npc._templates.concat([npc.npcClass.name, 'generic']).includes(system.class))
        )
      })
      const sortedAndGrouped = _.groupBy(
        _.orderBy(preSort, ['base', 'type', 'name'], ['desc', 'desc', 'asc']),
        'class'
      )
      // forcibly sort the object to have the class's systems first, then generic, then everything else
      return {
        [npc.npcClass.name]: sortedAndGrouped[npc.npcClass.name],
        generic: sortedAndGrouped['generic'],
        // pick sorted object removing classname and generic
        ..._.pickBy(
          sortedAndGrouped,
          (value, key) => ![npc.npcClass.name, 'generic'].includes(key)
        ),
      }
    },

    mySystems(): NPCSystem.Any[] {
      return _.orderBy(this.npc.systems, ['base', 'type', 'name'], ['desc', 'desc', 'asc'])
    },

    roleColor(): string {
      return `role--${this.npc.npcClass.role}`
    },
  },
  methods: {
    editName(): void {
      this.editingName = true
      this.newName = (this.npc as NPC)._name || ''
      this.$nextTick(() => {
        ;(this.$refs.namefield as any).focus()
      })
    },

    submitName() {
      if (this.newName) {
        ;(this.npc as NPC)._name = this.newName
      }
      this.editingName = false
    },

    editStats(): void {
      this.editingStats = true
    },

    submitStats() {
      console.log(this.npc.stats)
      console.log(this.stats)
      console.log(this.stats.statcaps)
      var newStats = _.clone(this.npc.stats) as NPCStats
      for (var s in this.stats) {
        if (typeof this.stats[s] === 'string') {
          this.stats[s] = Number(this.stats[s])
        }
        newStats[this.statMap[s]] = this.stats[s]
        if (newStats.statcaps[this.statMap[s]] != undefined) {
          const cap = newStats.statcaps[this.statMap[s]]
          if (cap < newStats[this.statMap[s]]) newStats[this.statMap[s]] = cap
        }
      }
      for (var h in this.hase) {
        if (typeof this.hase[h] === 'string') {
          this.hase[h] = Number(this.hase[h])
        }
        newStats[this.statMap[h]] = this.hase[h]
        if (newStats.statcaps[this.statMap[h]] != undefined) {
          const cap = newStats.statcaps[this.statMap[h]]
          console.log(cap)
          if (cap < newStats[this.statMap[h]]) newStats[this.statMap[h]] = cap
        }
      }
      ;(this.npc as NPC).stats = newStats
      this.editingStats = false
    },
  },
  watch: {
    npc: {
      handler: function onEditNPC(val: NPC) {
        this.$store.commit('npcDesigner/edit', val)
      },
      deep: true,
    },
  },
})
</script>

<style scoped>
.npc-builder {
  width: 90%;
  margin: 0 auto;
}
/* fixing some weird positioning glitches with the name-edit transition */
.name.fade-transition-enter-active {
  position: relative;
  top: -2px;
}
.name.fade-transition-leave-active {
  position: relative;
  bottom: 1px;
}
.v-input {
  padding: 0 !important;
  margin: 0 !important;
}
.v-input__slot {
  margin-bottom: 0 !important;
}
.v-input .v-messages {
  display: none;
}
.label {
  font-size: 1em;
  font-weight: bold;
}
/* .v-select__selection {
    font-size: 24px;
    margin-left: 60%;
} */
.picker-card {
  border-color: rgba(0, 0, 0, 0.125) !important;
  background-color: #f8f9fa !important;
  height: 250px;
  overflow-y: auto !important;
}

.picker-card .v-tabs__bar {
  border-radius: 0;
}
</style>
