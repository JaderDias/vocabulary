#!/usr/bin/env perl
use strict;
use warnings;
use Array::Utils qw/array_diff/;
use List::Util qw/min/;

my @exclude   = read_lines('exclude');
my @words     = read_lines($ARGV[0]);

@words = array_diff(@words, @exclude);

my $max_index = min($#words, 50000 - 1);
@words = @words[0..$max_index];
write_lines('dictionary', @words);

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
