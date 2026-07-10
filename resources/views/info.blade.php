@extends('layout.app')
@section('content')
<div class="trainer-info">
    <h2>Trainer Info</h2>

    <p>
        Name: {{ $trainer->name }}<br/>
        email: {{ $account->email }}<br/>
        Trainer ID: {{ $account->trainerID }}<br/><br/>

        Pokedex: {{ $trainer->dexCount }}<br/>
        Shiny Pokedex: {{ $trainer->shinyDex }}<br/>
        Pokemon Caught: {{ $trainer->monCount }}<br/>
        Shiny Pokemon: {{ $trainer->shinyCount }}<br/>

    </p>
</div>
@endsection