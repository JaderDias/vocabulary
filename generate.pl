#!/usr/bin/env perl
use strict;
use warnings;
use IO::Uncompress::Unzip qw(unzip $UnzipError);
use IO::Uncompress::Gunzip qw(gunzip $GunzipError);
use JSON qw(to_json);

my $max_words = 40000;
my $count = 0;
my $previous_word;
my $previous_count = 0;
my %ngrams = ();

while(my $ngram_file_name = shift @ARGV) {
        my $class;
        if($ngram_file_name =~ /\.zip$/) {
                $class = "IO::Uncompress::Unzip";
        } else {
                $class = "IO::Uncompress::Gunzip";
        }

        my $uncompress = new $class $ngram_file_name
                or die "can't open $ngram_file_name";

        while(my $line = $uncompress->getline()) {
            $count++;
            print "from $count lines we got " . (scalar keys %ngrams) . " words\n" if ($count % 1e7) == 0;
            next unless($line  =~ /^([a-z]+)\s+(\d+)\s+(\d+)\s/);
            my ($current_word, $year, $current_count) = ($1, $2, $3);
            next if $year < 1970;
            if(($previous_word // '') eq $current_word) {
                $previous_count += $current_count;
                next;
            }

            $ngrams{$previous_word} = $previous_count if $previous_word;
            $previous_word = $current_word;
            $previous_count = 0;
        }

        $uncompress->close();
        print "after finishing reading $ngram_file_name with $count lines we found " . (scalar keys %ngrams) . " words\n";
        my @words = sort { $ngrams{$b} <=> $ngrams{$a} } keys %ngrams;
        %ngrams = map { $_ => $ngrams{$_} } @words[0..($max_words-1)];
        print "reduced to " . (scalar keys %ngrams) . " words\n";
}

my @words = sort { $ngrams{$b} <=> $ngrams{$a} } keys %ngrams;
my $output = 'public/dictionary.json';
open(my $fh, '>', $output) or die "Could not open file '$output' $!";
print $fh to_json \@words;
close $fh;
