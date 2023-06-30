<template>
    <v-container fluid pa-0>
        <v-row no-gutters>
            <v-col cols="12">
                <div class="parking-container">
                    <slot></slot>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<style>
.parking-container {
    background-color: #3D4C56;
    width: 100%;
    height: 395px;
    border-radius: 0 0 50% 50% / 50px;

}

.parking-values {
    color: white;
    margin-bottom: -20px;
}

.location-values {
    padding-top: 50px;
    max-width: fit-content;
    font-size: 35px;
}

.welcome {
    font-weight: 200;
    margin-bottom: -5px !important;
}

.location {
    font-weight: 700;
}
</style>