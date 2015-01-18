#!/usr/bin/env perl
use strict;
use warnings;
use Array::Utils qw/array_diff/;
use List::Util qw/min/;

my ($language) = @ARGV;

my @exclude   = read_lines("$language.exclude");
my @words     = read_lines("../$language.dictionary");

@words = array_diff(@words, @exclude);

my $max_index = min($#words, 50000 - 1);
my @words_sample = ();
for(my $index = 2; $index <= $max_index; $index += 5) {
        push @words_sample, $words[$index];
}

write_lines("$language.sample.csv", @words_sample);

sub write_lines {
        my $file_name = shift;
        open(my $fh, '>', $file_name) or die "Could not open file '$file_name' $!";
        print $fh join "\n", @_;
        close $fh;
}

sub read_lines {
        my ($file_name) = @_;
        my @lines = ();
        open(my $fh, '<', $file_name) or die "Cold not open file '$file_name' $!";
        while (my $row = <$fh>) {
                chomp $row;
                push @lines, $row;
        }

        close $fh;
        return @lines;
}
