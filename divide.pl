#!/usr/bin/env perl
use strict;
use warnings;

my $max_words = 40000;
my $count = 0;
my $previous_word;
my $previous_count = 0;
my %ngrams = ();

my @words = sort { $ngrams{$b} <=> $ngrams{$a} } keys %ngrams;
my $questionnaire_length = 20;
for my $output(qw/large medium small/) {
        my @lines;
        my $numerator = 1;
        my $denominator = 2;
        for my $i(1..$questionnaire_length) {
                my $index = int(($numerator * (scalar @words)) / $denominator);
                push @lines, $words[$index];
                $numerator += 2;
                if($numerator >= $denominator) {
                        $denominator *= 2;
                        $numerator = 1;
                }
        }

        write_lines("$output.json", @lines);
        @words = @words[0..(-1 + scalar @words)];
        $questionnaire_length *= 2;
}

sub write_lines {
        my $file_name = shift;
        open(my $fh, '>', $file_name) or die "Could not open file '$file_name' $!";
        print $fh join '\n', @_;
        close $fh;
}
