<script setup lang="ts">
import TextLink from '@/Components/TextLink.vue';
import SvgFacebook from '@/Icons/SvgFacebook.vue';
import SvgInstagram from '@/Icons/SvgInstagram.vue';
import SvgMastodon from '@/Icons/SvgMastodon.vue';
import SvgTwitter from '@/Icons/SvgTwitter.vue';
import SvgYouTube from '@/Icons/SvgYouTube.vue';
import { Head } from '@inertiajs/vue3';

export interface Props {
    title: string;
    showFooter?: boolean;
}

withDefaults(defineProps<Props>(), {
    showFooter: true,
});
</script>

<template>
    <Head :title="title" />

    <!-- Page Heading -->
    <header v-if="$slots.header" class="bg-white shadow">
        <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <slot name="header" />
        </div>
    </header>

    <slot />

    <footer v-if="showFooter" class="flex flex-col items-center bg-gray-200 py-8 print:hidden">
        <div class="flex space-x-2">
            <a class="rounded p-1 outline-none focus:ring-2 focus:ring-green-500" href="https://twitter.com/#!/veg_plotter">
                <SvgTwitter class="size-12 fill-[#8A7090]" aria-hidden="true" />
            </a>
            <a class="rounded p-1 outline-none focus:ring-2 focus:ring-green-500" rel="me" href="https://mastodon.world/@vegplotter">
                <SvgMastodon class="size-12 fill-[#8A7090]" aria-hidden="true" />
            </a>
            <a class="rounded p-1 outline-none focus:ring-2 focus:ring-green-500" href="https://www.facebook.com/pages/VegPlotter/824995367538067?sk=timeline">
                <SvgFacebook class="size-12 fill-[#8A7090]" aria-hidden="true" />
            </a>
            <a class="rounded p-1 outline-none focus:ring-2 focus:ring-green-500" href="https://www.instagram.com/vegplotter/">
                <SvgInstagram class="size-12 fill-[#8A7090]" aria-hidden="true" />
            </a>
            <a class="rounded p-1 outline-none focus:ring-2 focus:ring-green-500" href="https://www.youtube.com/c/Vegplotter">
                <SvgYouTube class="size-12 fill-[#8A7090]" aria-hidden="true" />
            </a>
        </div>
        <div class="mt-8 flex w-full max-w-xl flex-col items-center md:flex-row md:justify-between">
            <figure class="w-32">
                <img src="/images/logoSQ500.png" alt="VegPlotter Garden Planner">
            </figure>

            <div class="mt-4">
                <h1 class="text-2xl font-semibold text-[#8A7090]">
                    Useful Links
                </h1>
                <ul
                    class="mt-4 grid gap-2 sm:grid-cols-2"
                >
                    <li>
                        <TextLink href="allotment-planner">
                            Allotment Planner
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="square-foot-garden-planner">
                            Square Foot Garden Planner
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="/">
                            Vegetable Garden Planner
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="blog">
                            Blog
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="schools">
                            Schools &amp; Teachers
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="about">
                            About Us
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="terms">
                            Terms of Use
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="privacy">
                            Privacy Policy
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="affiliates">
                            Become An Affiliate
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="pricing">
                            Pricing
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="giftcertificates">
                            Gift Vouchers / Certificates
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="refer-a-friend">
                            Refer a friend
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="newsletter">
                            Newsletter
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="help">
                            Userguides
                        </TextLink>
                    </li>
                    <li>
                        <TextLink href="contact">
                            Contact Us
                        </TextLink>
                    </li>
                </ul>
            </div>
        </div>
    </footer>
</template>
