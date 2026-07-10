<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //
        Schema::create('pokemon', function (Blueprint $table) {
            $table->id();
            $table -> string('species');
            $table -> string('nickname')->nullable();
            $table -> string('gender');
            $table -> boolean('shiny');
            $table -> integer('level');
            $table -> timestamp('dateCaught');
            $table -> string('game');
            $table -> integer('generation');
            $table -> string('nature');
            $table -> string('location')->nullable();
            $table -> string('method')->nullable();
            $table -> text('moves')->nullable(); // Comma-separated list?
            $table -> json('baseStats')->nullable();
            $table -> integer('trainer_id');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
