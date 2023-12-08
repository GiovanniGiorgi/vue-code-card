# Vue Code Card 
by [@GiovanniGiorgi](https://github.com/GiovanniGiorgi)

## Introduction
Custom Card for [HomeAssistant](home-assistant.io) that supports CSS and HTML with [VUE](https://github.com/vuejs/petite-vue/tree/main) sintax to easly add some logic

## Options
| Name              | Type    | Requirement  | Description                                 | Default             |
| ----------------- | ------- | ------------ | ------------------------------------------- | ------------------- |
| type              | string  | **Required** | `custom:vue-code-card`                      |                     |
| title             | string  | **Optional** | Card name                                   | ``                  |
| template          | string  | **Required** | HTML card content                           | ``                  |
| style             | string  | **Optional** | CSS applied to the card                     | ``                  |
| default           | boolean | **Optional** | Use ha-card default layout                  | `true`              |
| cards             | list    | **Optional** | List of cards                               |                     |

## Usage
Define your card in yaml, adding inner template and style.\
Use double brackets {{ }} to resolve variable or JS expression

````YAML
type: custom:vue-code-card
title: Language
default: true
template: |
  <p> selected: {{ hass.language }} </p>
  <button @click="console.log(hass)">debug</button>
style: |
  .card-content {
    color: red
  }
````
### Scope
| Name               | Type    |  Description                                                                    |
| ------------------ | ------- | ------------------------------------------------------------------------------- |
| config             | Object  | Initial config used in YAML                                                     |
| hass               | Object  | Data from your Home Assistant instance                                          |
| data               | Object  | Empty object useufll to define reactive variables                               |
| state(\<EntityId>) | String  | Return the state of the `Entity`                                                |
| getConfig()        | Object  | Return the original Config (not the Proxy used for reactive purpose)            |
| getHass()          | Object  | Return the original hass (not the Proxy used for reactive purpose)              |

To define your own variables that update reactively in the DOM, I suggest to use _'data.own_var_name = value'_ (exemple below)
instead of _'v-scope'_.

## VUE Directives
VUE directives allow to integrate some logic in your code, such as conditionally render or iterate some HTML elements ([petite-vue](https://github.com/vuejs/petite-vue) for reference)

- `v-if` / `v-else` / `v-else-if`
````html
<p v-if="isThis">
  this
</p>
<p v-else>
  that
</p>

``````
- `v-for`
````html
<li v-for="item in items">
  {{ item.message }}
</li>

``````
- `v-effect`
`````html
<div v-effect="data.count = 0">
  <div v-effect="$el.textContent = data.count"></div>
  <button @click="data.count++">++</button>
</div>
``````
- `v-bind` (including `:` shorthand and class/style special handling)
````html
<img v-bind:src="myUrl">
````
- `v-on` (including `@` shorthand and all modifiers)
- `v-model` (all input types + non-string `:value` bindings)
- `v-show`
- `v-html`
- `v-text`
- `v-pre`
- `v-once`
- `v-cloak`
- `@vue:mounted` & `@vue:unmounted` events

## Custom HA Directives [WIP]
### `v-card`
accepts arg or value _`n`_ as index in cards array\
(WARNING: arg passed with colons _'`:`'_ do not resolve variables )
````yaml
type: custom:vue-code-card
title: Day/Night
default: false
template: |
  <h1>{{ config.title }}</h1>
  <div v-card:0 ></div> 
# <!-- OR v-card="0" -->
cards:
  - type: entities
    entities:
      - entity: sun.sun
````
or directly a valid _`object`_ as value  ( { type: 'string', [...] } )
````yaml
type: custom:vue-code-card
title: Day/Night
default: false
template: |
  <h1>{{ config.title }}</h1>
  <div v-for="card in config.cards"
       v-card="card">
  </div>
cards:
  - type: entities
    entities:
      - entity: sun.sun
  - type: entity
    entity: person.test

````

### `v-entity`
specify the arg _`:type`_ and the `entityId` as value
````html
<div v-entity:switch="input_boolean.test"></div>
```````

## Default Layout
By default the card has this structure surrounding your template:
````html
<ha-card>
  <div class="card-content">
    <!-- your Template-->
  </div>
</ha-card>
````
But you can create your own free template with the option _'default: false'_.\
In this case no background, no border, no margin will be set
````yaml
type: custom:vue-code-card
title: Title
default: false
template: |
  <h1> {{ config.title }} <h1>
  <div>
  ...
  </div>
````