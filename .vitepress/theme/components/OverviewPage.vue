<script setup lang="ts">
import { useData } from 'vitepress'
import { TkArticlePage } from 'vitepress-theme-teek'

const { frontmatter } = useData()
</script>

<template>
  <TkArticlePage doc>
    <div class="tk-catalogue__header" role="group" aria-labelledby="overview-header-title">
      <h2 id="overview-header-title">{{ frontmatter.title }}</h2>
      <div class="description">{{ frontmatter.desc || frontmatter.description }}</div>
    </div>

    <div class="vp-doc">
      <Content />
    </div>
  </TkArticlePage>
</template>
