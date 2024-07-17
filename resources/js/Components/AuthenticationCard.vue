<template>
    <div class="flex flex-col items-center bg-gray-50">
        <div>
            <slot name="logo" />
        </div>

        <div class="w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
            <slot />
        </div>
    </div>
</template>
