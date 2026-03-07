import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const eventsByYear = {
  "2025-26": [
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#4ade80" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#60a5fa" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fde047" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#f472b6" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#c084fc" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb923c" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#2dd4bf" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb7185" },
  ],
  "2024-25": [
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#60a5fa" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fde047" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#4ade80" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#f472b6" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#c084fc" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb923c" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#2dd4bf" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb7185" },
  ],
  "2023-24": [
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fde047" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#60a5fa" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#4ade80" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#f472b6" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#c084fc" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb923c" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#2dd4bf" },
    { title: "PIXEL X: FRONTEND MASTERY", date: "18th", month: "October, 2025", desc: "A deep dive into modern frontend architecture, design systems, and pixel-perfect UI craftsmanship.", overview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.', neque: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque illo aliquid aspernatur rem placeat nisi vel, nam ad eveniet quos? Accusantium repudiandae neque odio recusandae, incidunt dolore tenetur, ad amet veniam corporis veritatis.Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi dolorem itaque neque culpa natus autem repudiandae inventore sequi repellat nemo consequuntur eligendi non voluptatem explicabo doloremque .', nequeimg: 'poster.png', bg: "#fb7185" },
  ],
};

const YEARS = ["2025-26", "2024-25", "2023-24"]

const EventCard = ({ event, onMoreInfo, scale = 1 }) => (
  <div
    className='group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 mx-auto'
    style={{
      backgroundColor: event.bg,
      maxWidth: `${Math.min(100, 100 + (scale - 0.85) * 50)}%`,
      minWidth: 'min(320px, 92vw)', width: '100%'
    }}
  >
    <div className='absolute inset-0 bg-gradient-to-br from-black/10 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>

    <div className='relative flex flex-col sm:flex-row gap-4 p-6 sm:p-8'>
      <div className='relative flex-shrink-0'>
        <div className='relative overflow-hidden rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-xl transition-shadow duration-300'>
          <img
            src="/poster.png"
            alt={event.title}
            className='w-screen h-32 sm:w-60 sm:h-60 object-cover transform group-hover:scale-105 transition-transform duration-500'
            
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
        </div>
        <div className='absolute -top-1 -right-1 w-4 h-4 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
      </div>
      <div className='flex-1 flex flex-col justify-between min-h-[140px] sm:min-h-[120px]'>
        <div className='space-y-2'>
          <h2 className={`font-bold leading-tight text-black group-hover:text-black/90 transition-colors duration-300 text-2xl sm:text-3xl md:text-4xl`}>
            {event.title}
          </h2>
          <p className={`leading-relaxed line-clamp-3 group-hover:text-black/80 transition-colors duration-300 text-lg text-black/70`}>
            {event.desc}
          </p>
        </div>
        <div className='flex justify-between items-end mt-4'>
          <div className='text-black'>
            <div className={`font-bold leading-none mb-1 group-hover:scale-105 transition-transform duration-300 origin-left text-2xl`}>
              {event.date}
            </div>
            <div className={`font-medium uppercase tracking-wide text-sm text-black/70`}>
              {event.month}
            </div>
          </div>

          <button
            onClick={() => onMoreInfo(event)}
            className={`relative bg-black/90 hover:bg-black text-white border border-white/30 hover:border-white/50 rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-black/25 transform hover:scale-105 active:scale-95 overflow-hidden group/button px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base`}
          >
            <span className='relative z-10 flex items-center gap-2'>
              More Info
              
            </span>
            <div className='absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/button:opacity-100 transition-opacity duration-300'></div>
          </button>
        </div>
      </div>
    </div>
    <div className='absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
  </div>
)

// Spring physics hook — gives that smooth, bubbly overshoot feel
const useSpring = (target, stiffness = 0.07, damping = 0.68) => {
  const value = useRef(target)
  const velocity = useRef(0)
  const raf = useRef(null)
  const [display, setDisplay] = useState(target)

  useEffect(() => {
    const animate = () => {
      const force = (target - value.current) * stiffness
      velocity.current = (velocity.current + force) * damping
      value.current += velocity.current

      if (Math.abs(velocity.current) > 0.0005 || Math.abs(target - value.current) > 0.0005) {
        setDisplay(value.current)
        raf.current = requestAnimationFrame(animate)
      } else {
        value.current = target
        setDisplay(target)
      }
    }

    cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(raf.current)
  }, [target, stiffness, damping])

  return display
}

const ParallaxRow = ({ event, onMoreInfo, index, totalEvents }) => {
  const rowRef = useRef(null)
  const [targetParallax, setTargetParallax] = useState(0)
  const [targetScale, setTargetScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!rowRef.current || isMobile) return

      const rect = rowRef.current.getBoundingClientRect()
      const windowH = window.innerHeight
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowH / 2
      const distanceFromCenter = elementCenter - viewportCenter

      const progress = (windowH - elementCenter) / windowH
      setTargetParallax(progress * 25)

      const maxDistance = windowH / 2
      const normalizedDistance = Math.abs(distanceFromCenter) / maxDistance
      setTargetScale(Math.max(0.85, 1 - normalizedDistance * 0.15))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isMobile])

  // Spring-interpolated values for buttery, bubbly motion
  const parallax = useSpring(targetParallax, 0.07, 0.68)
  const scale = useSpring(targetScale, 0.06, 0.70)

  return (
    <div ref={rowRef} className='my-6 sm:my-8 px-4 sm:px-6 md:px-8'>
      <div
        style={{
          transform: `translateY(${parallax}px) scale(${scale})`,
          willChange: 'transform',
          transformOrigin: 'center center',

        }}
      >
        <EventCard event={event} onMoreInfo={onMoreInfo} scale={scale} />
      </div>
    </div>
  )
}

export default function PastEvents() {
  const [selectedYear, setSelectedYear] = useState("2025-26")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const handleMoreInfo = (event) => {
    navigate('/event-details', { state: { event, year: selectedYear } })
    window.scrollTo(0, 0)
  }

  const events = eventsByYear[selectedYear]

  useEffect(() => {
    const fn = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  return (
    <div>
      <div className='flex justify-between px-4 mt-12 sm:px-6 md:px-8 py-6 sm:py-8 items-center'>
        <h2 className='text-2xl sm:text-3xl md:text-4xl font-light'>Past Events</h2>

        <div ref={dropdownRef} className='relative'>
          <button
            onClick={() => setDropdownOpen(v => !v)}
            className='flex gap-2 px-4 sm:px-6 py-1.5 sm:py-2 border border-white rounded-full items-center justify-center cursor-pointer bg-transparent text-white hover:bg-white/10 transition-colors text-sm sm:text-base'
          >
            <p>{selectedYear}</p>
            <ChevronDown
              size={16}
              style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {dropdownOpen && (
            <div className='absolute right-0 mt-2 bg-[#0a0a1a] border border-white/20 rounded-xl overflow-hidden shadow-2xl z-50 min-w-full'>
              {YEARS.map(year => (
                <button
                  key={year}
                  onClick={() => { setSelectedYear(year); setDropdownOpen(false) }}
                  className='block w-full text-left px-5 py-3 text-sm cursor-pointer transition-colors'
                  style={{
                    background: year === selectedYear ? 'rgba(255,255,255,0.08)' : 'transparent',
                    color: year === selectedYear ? '#fff' : 'rgba(255,255,255,0.55)',
                    fontWeight: year === selectedYear ? 600 : 400,
                    border: 'none',
                  }}
                >
                  {year}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className='pb-6 sm:pb-8'>
        {events.map((event, i) => (
          <ParallaxRow
            key={`${selectedYear}-${i}`}
            event={event}
            onMoreInfo={handleMoreInfo}
            index={i}
            totalEvents={events.length}
          />
        ))}
      </div>
    </div>
  )
}


