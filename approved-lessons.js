// Preserved approved content; generated deterministically from content/approved/source-jobs.json.
export const preservedLessons = [
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "reviews",
      "source_id": "book-associate-cet-study-guide",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01",
    "generated": true,
    "subtrack": "generated",
    "title": "Prefix Conversions by Unit Ratios and Reverse Checks",
    "description": "Instead of relying on decimal shifts, convert through the base unit or multiply by a unit ratio equal to one. Use both a larger-unit/smaller-number check and a reverse conversion. The book-specific reinforcement is its verified scientific-notation, pF-to-µF, and kHz-to-Hz/MHz examples; the checking method and fresh exercises are instructional additions.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Review purpose and source contribution",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "heading": "Recover the value from the exponent",
        "source_ids": [
          "S1"
        ]
      },
      {
        "heading": "Worked source example: picofarads to microfarads",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "heading": "Worked source example: one frequency, three unit expressions",
        "source_ids": [
          "S1",
          "S2"
        ]
      }
    ],
    "objectives": [],
    "html": "<p>Instead of relying on decimal shifts, convert through the base unit or multiply by a unit ratio equal to one. Use both a larger-unit/smaller-number check and a reverse conversion. The book-specific reinforcement is its verified scientific-notation, pF-to-µF, and kHz-to-Hz/MHz examples; the checking method and fresh exercises are instructional additions.</p><h3>Review purpose and source contribution</h3><p>This is reinforcement of the powers-of-ten and metric-prefix material already covered in Mathematics Companion, not a new circuit concept. The source-specific contribution is the chapter’s notation examples and electronic conversions: printed p. 16 gives 125000 = 1.25 × 10^5, 0.125 = 1.25 × 10^-1, and 0.007 = 7 × 10^-3; its conversion examples continue onto printed p. 17. The alternative method here is instructional: express the starting unit as a power of ten, divide by the size of the target unit, and check the direction of the numerical change. All practice questions below are newly authored, not transcribed book exercises.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Recover the value from the exponent</h3><p>Scientific notation separates a number into a coefficient and a scale factor. In 1.25 × 10^5, the factor 10^5 means 100000, so multiplication recovers 125000. A negative exponent denotes a reciprocal: 10^-3 = 1/1000. Thus the source’s 0.007 = 7 × 10^-3 means seven thousandths, not a negative number. For standard scientific notation of a positive value, use a coefficient at least 1 and less than 10. When rewriting the number, preserve its value: if the coefficient becomes ten times smaller, the power-of-ten factor must become ten times larger. Check by multiplying the coefficient by the scale factor rather than trusting a remembered decimal-shift direction.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.)</p><h3>Worked source example: picofarads to microfarads</h3><p>The prefix table on printed p. 16 identifies pico as 10^-12 and micro as 10^-6. Here F abbreviates farad, so pF and µF name different-sized units of capacitance. For the verified example, first write 1000 pF = 1000 × 10^-12 F = 10^-9 F. One microfarad is 10^-6 F; therefore the numerical value in microfarads is 10^-9/10^-6 = 10^-3. This gives 1000 pF = 0.001 µF, matching the source. Equivalently, multiply 1000 pF by the unit ratio (1 µF)/(1000000 pF); the pF units cancel. That ratio equals one, so it changes the unit expression without changing the capacitance. The result should have a smaller numerical value because µF is the larger unit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Worked source example: one frequency, three unit expressions</h3><p>The verified frequency example on printed pp. 16–17 is 700 kHz = 700000 Hz = 0.7 MHz. Hz abbreviates hertz; k means kilo, or 10^3, and M means mega, or 10^6. Starting in hertz makes both steps visible: 700 kHz = 700 × 10^3 Hz = 7 × 10^5 Hz. To express this in megahertz, divide its hertz value by 10^6: (7 × 10^5)/(10^6) = 7 × 10^-1 = 0.7 MHz. Preserve prefix case: the source’s kilo and mega prefixes are written k and M. Finally, reverse the conversion: 0.7 MHz × 1000 kHz/MHz = 700 kHz. The unchanged starting value is a useful arithmetic check; the magnitude check is that larger units give smaller numerical values.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Write 470000 and 0.000032 in scientific notation. Show how the power of ten preserves each original value.",
        "answer": "470000 = 4.7 × 10^5; 0.000032 = 3.2 × 10^-5.",
        "explanation": "470000 = 4.7 × 100000 = 4.7 × 10^5. Also, 0.000032 = 3.2 × 0.00001 = 3.2 × 10^-5. In each case the coefficient lies between 1 and 10. The exponent records the scale, rather than changing the number.",
        "source_ids": [
          "S1"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Convert 2200 pF to µF using an intermediate value in farads.",
        "answer": "2200 pF = 2.2 × 10^-9 F = 0.0022 µF.",
        "explanation": "Pico means 10^-12 and micro means 10^-6. Thus 2200 pF = 2200 × 10^-12 F = 2.2 × 10^-9 F. Expressing that value in microfarads gives (2.2 × 10^-9)/(10^-6) = 2.2 × 10^-3 µF. The numerical value becomes smaller because a microfarad is a larger unit than a picofarad.",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Convert 450 kHz to both Hz and MHz. Explain why one numerical result is larger than 450 and the other is smaller.",
        "answer": "450 kHz = 450000 Hz = 0.45 MHz.",
        "explanation": "A kilohertz is 1000 hertz, so 450 kHz = 450 × 1000 Hz = 450000 Hz. A megahertz is 1000 kilohertz, so 450 kHz = 450/1000 MHz = 0.45 MHz. Smaller units require more units to describe the same frequency; larger units require fewer.",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A calculation claims that 680 pF = 680000000 µF. Identify the direction error and give the correct conversion.",
        "answer": "The conversion should divide by 10^6: 680 pF = 0.000680 µF.",
        "explanation": "Going from picofarads to microfarads means expressing the same capacitance in a unit one million times larger. Divide the numerical value by one million, rather than multiply: 680/1000000 = 0.000680. A reverse check gives 0.000680 × 1000000 = 680 pF.",
        "source_ids": [
          "S1",
          "S2"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-Q01",
        "type": "reflection",
        "prompt": "Write 470000 and 0.000032 in scientific notation. Show how the power of ten preserves each original value.",
        "explain": "470000 = 4.7 × 100000 = 4.7 × 10^5. Also, 0.000032 = 3.2 × 0.00001 = 3.2 × 10^-5. In each case the coefficient lies between 1 and 10. The exponent records the scale, rather than changing the number.",
        "rubric": "Expected answer: 470000 = 4.7 × 10^5; 0.000032 = 3.2 × 10^-5.\nReasoning: 470000 = 4.7 × 100000 = 4.7 × 10^5. Also, 0.000032 = 3.2 × 0.00001 = 3.2 × 10^-5. In each case the coefficient lies between 1 and 10. The exponent records the scale, rather than changing the number.",
        "safety": false,
        "source_ids": [
          "S1"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-Q02",
        "type": "reflection",
        "prompt": "Convert 2200 pF to µF using an intermediate value in farads.",
        "explain": "Pico means 10^-12 and micro means 10^-6. Thus 2200 pF = 2200 × 10^-12 F = 2.2 × 10^-9 F. Expressing that value in microfarads gives (2.2 × 10^-9)/(10^-6) = 2.2 × 10^-3 µF. The numerical value becomes smaller because a microfarad is a larger unit than a picofarad.",
        "rubric": "Expected answer: 2200 pF = 2.2 × 10^-9 F = 0.0022 µF.\nReasoning: Pico means 10^-12 and micro means 10^-6. Thus 2200 pF = 2200 × 10^-12 F = 2.2 × 10^-9 F. Expressing that value in microfarads gives (2.2 × 10^-9)/(10^-6) = 2.2 × 10^-3 µF. The numerical value becomes smaller because a microfarad is a larger unit than a picofarad.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-Q03",
        "type": "reflection",
        "prompt": "Convert 450 kHz to both Hz and MHz. Explain why one numerical result is larger than 450 and the other is smaller.",
        "explain": "A kilohertz is 1000 hertz, so 450 kHz = 450 × 1000 Hz = 450000 Hz. A megahertz is 1000 kilohertz, so 450 kHz = 450/1000 MHz = 0.45 MHz. Smaller units require more units to describe the same frequency; larger units require fewer.",
        "rubric": "Expected answer: 450 kHz = 450000 Hz = 0.45 MHz.\nReasoning: A kilohertz is 1000 hertz, so 450 kHz = 450 × 1000 Hz = 450000 Hz. A megahertz is 1000 kilohertz, so 450 kHz = 450/1000 MHz = 0.45 MHz. Smaller units require more units to describe the same frequency; larger units require fewer.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-Q04",
        "type": "reflection",
        "prompt": "A calculation claims that 680 pF = 680000000 µF. Identify the direction error and give the correct conversion.",
        "explain": "Going from picofarads to microfarads means expressing the same capacitance in a unit one million times larger. Divide the numerical value by one million, rather than multiply: 680/1000000 = 0.000680. A reverse check gives 0.000680 × 1000000 = 680 pF.",
        "rubric": "Expected answer: The conversion should divide by 10^6: 680 pF = 0.000680 µF.\nReasoning: Going from picofarads to microfarads means expressing the same capacitance in a unit one million times larger. Divide the numerical value by one million, rather than multiply: 680/1000000 = 0.000680. A reverse check gives 0.000680 × 1000000 = 680 pF.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-Q05",
        "type": "reflection",
        "prompt": "Convert 0.125 MHz to kHz and then Hz. Use a reverse conversion to check your answer, and preserve the prefix capitalization.",
        "explain": "Mega represents 10^6 and kilo represents 10^3. Therefore 0.125 MHz = 0.125 × 1000 kHz = 125 kHz, and 125 kHz = 125 × 1000 Hz = 125000 Hz. Reversing the calculation, 125000 Hz divided by 10^6 gives 0.125 MHz. Write lowercase k for kilo and uppercase M for mega.",
        "rubric": "Expected answer: 0.125 MHz = 125 kHz = 125000 Hz; reversing the conversion returns 0.125 MHz.\nReasoning: Mega represents 10^6 and kilo represents 10^3. Therefore 0.125 MHz = 0.125 × 1000 kHz = 125 kHz, and 125 kHz = 125 × 1000 Hz = 125000 Hz. Reversing the calculation, 125000 Hz divided by 10^6 gives 0.125 MHz. Write lowercase k for kilo and uppercase M for mega.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-P06",
        "type": "reflection",
        "prompt": "Explain the main idea from “Review purpose and source contribution” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "This is reinforcement of the powers-of-ten and metric-prefix material already covered in Mathematics Companion, not a new circuit concept. The source-specific contribution is the chapter’s notation examples and electronic conversions: printed p. 16 gives 125000 = 1.25 × 10^5, 0.125 = 1.25 × 10^-1, and 0.007 = 7 × 10^-3; its conversion examples continue onto printed p. 17. The alternative method here is instructional: express the starting unit as a power of ten, divide by the size of the target unit, and check the direction of the numerical change. All practice questions below are newly authored, not transcribed book exercises.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-P07",
        "type": "reflection",
        "prompt": "Use the explanation under “Recover the value from the exponent” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Scientific notation separates a number into a coefficient and a scale factor. In 1.25 × 10^5, the factor 10^5 means 100000, so multiplication recovers 125000. A negative exponent denotes a reciprocal: 10^-3 = 1/1000. Thus the source’s 0.007 = 7 × 10^-3 means seven thousandths, not a negative number. For standard scientific notation of a positive value, use a coefficient at least 1 and less than 10. When rewriting the number, preserve its value: if the coefficient becomes ten times smaller, the power-of-ten factor must become ten times larger. Check by multiplying the coefficient by the scale factor rather than trusting a remembered decimal-shift direction.",
        "safety": false,
        "source_ids": [
          "S1"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-P08",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Worked source example: picofarads to microfarads”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The prefix table on printed p. 16 identifies pico as 10^-12 and micro as 10^-6. Here F abbreviates farad, so pF and µF name different-sized units of capacitance. For the verified example, first write 1000 pF = 1000 × 10^-12 F = 10^-9 F. One microfarad is 10^-6 F; therefore the numerical value in microfarads is 10^-9/10^-6 = 10^-3. This gives 1000 pF = 0.001 µF, matching the source. Equivalently, multiply 1000 pF by the unit ratio (1 µF)/(1000000 pF); the pF units cancel. That ratio equals one, so it changes the unit expression without changing the capacitance. The result should have a smaller numerical value because µF is the larger unit.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-P09",
        "type": "reflection",
        "prompt": "How would you check that you understood “Worked source example: one frequency, three unit expressions” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified frequency example on printed pp. 16–17 is 700 kHz = 700000 Hz = 0.7 MHz. Hz abbreviates hertz; k means kilo, or 10^3, and M means mega, or 10^6. Starting in hertz makes both steps visible: 700 kHz = 700 × 10^3 Hz = 7 × 10^5 Hz. To express this in megahertz, divide its hertz value by 10^6: (7 × 10^5)/(10^6) = 7 × 10^-1 = 0.7 MHz. Preserve prefix case: the source’s kilo and mega prefixes are written k and M. Finally, reverse the conversion: 0.7 MHz × 1000 kHz/MHz = 700 kHz. The unchanged starting value is a useful arithmetic check; the magnitude check is that larger units give smaller numerical values.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01-R01-P10",
        "type": "reflection",
        "prompt": "Explain the main idea from “Review purpose and source contribution” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "This is reinforcement of the powers-of-ten and metric-prefix material already covered in Mathematics Companion, not a new circuit concept. The source-specific contribution is the chapter’s notation examples and electronic conversions: printed p. 16 gives 125000 = 1.25 × 10^5, 0.125 = 1.25 × 10^-1, and 0.007 = 7 × 10^-3; its conversion examples continue onto printed p. 17. The alternative method here is instructional: express the starting unit as a power of ten, divide by the size of the target unit, and check the direction of the numerical change. All practice questions below are newly authored, not transcribed book exercises.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "prefixes",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U01",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "reviews",
      "source_id": "book-associate-cet-study-guide",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01",
    "generated": true,
    "subtrack": "generated",
    "title": "Rearrange, Then Test the Original Equality",
    "description": "Use the original equation as an independent test of every rearrangement: identify the multiplication, undo it on both sides, and substitute the result back. The source-specific contribution is the p. 17 product-and-quotient examples and 4y = 2; the substitution workflow, explicit nonzero-divisor qualifications, and error-detection exercises provide targeted reinforcement rather than a new source concept.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Source anchors and review approach",
        "source_ids": [
          "S3"
        ]
      },
      {
        "heading": "Read the relationship before calculating",
        "source_ids": [
          "S3"
        ]
      },
      {
        "heading": "Worked source example: solve and substitute",
        "source_ids": [
          "S3"
        ]
      },
      {
        "heading": "Rearrange a product into a quotient",
        "source_ids": [
          "S3"
        ]
      }
    ],
    "objectives": [],
    "html": "<p>Use the original equation as an independent test of every rearrangement: identify the multiplication, undo it on both sides, and substitute the result back. The source-specific contribution is the p. 17 product-and-quotient examples and 4y = 2; the substitution workflow, explicit nonzero-divisor qualifications, and error-detection exercises provide targeted reinforcement rather than a new source concept.</p><h3>Source anchors and review approach</h3><p>The verified “Equations” material on printed p. 17 describes an equation as an equality and uses letters for numerical quantities or unknowns. Its examples include a = bc, b = a/c, c = a/b, and 4y = 2. These are the source-specific anchors for this review. Equation rearrangement is a listed topic of Mathematics Companion; this connection does not establish that you have completed it. The alternative approach here pairs each rearrangement with a substitution check. The explanations and fresh practice are instructional additions, not additional transcribed book examples.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.)</p><h3>Read the relationship before calculating</h3><p>An equals sign says that the expressions on its two sides have the same value. A letter names a quantity; its value may be given or may be the unknown you want to find. In a = bc, the adjacent letters bc mean b multiplied by c. The equation therefore says that a equals the product of b and c. Rearranging does not change this relationship: it expresses the same relationship with a different letter isolated. These examples supply no physical units, so treat the letters as numerical quantities rather than assigning them electrical meanings.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.)</p><h3>Worked source example: solve and substitute</h3><p>The source example 4y = 2 means four times y equals two. To leave y by itself, undo multiplication by 4 with division by 4. Apply that operation to both sides: (4y)/4 = 2/4. Since 4/4 = 1, the left side becomes y, giving y = 2/4 = 0.5. The fraction 2/4 means two divided by four; it can also be simplified to 1/2. Now check the result in the original equation: 4 × 0.5 = 2. This check tests the answer against the starting relationship, rather than merely repeating the division.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.)</p><h3>Rearrange a product into a quotient</h3><p>For a = bc, choose which letter you want alone. To isolate b, undo its multiplication by c: divide both sides by c to obtain a/c = bc/c = b, or b = a/c. This step requires c ≠ 0. To isolate c instead, divide both sides by b: a/b = bc/b = c, or c = a/b, with b ≠ 0. Both quotient forms appear in the verified source; the nonzero conditions are mathematical qualifications explained here. Choose the divisor by identifying the factor multiplying your desired unknown, not by guessing which letter should go above the fraction bar.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Solve 4y = 2. Explain which operation preserves equality, then check your answer in the original equation.",
        "answer": "y = 0.5.",
        "explanation": "Divide both sides by 4: y = 2/4 = 0.5. Substituting gives 4 × 0.5 = 2, so the original equality holds. The fraction 2/4 and the decimal 0.5 describe the same value.",
        "source_ids": [
          "S3"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Solve 6x = 3 and verify the result by multiplication.",
        "answer": "x = 0.5.",
        "explanation": "The coefficient 6 multiplies x, so divide both sides by 6: x = 3/6 = 1/2 = 0.5. The check is 6 × 0.5 = 3.",
        "source_ids": [
          "S3"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Starting with a = bc, isolate b. Then find b when a = 18 and c = 3.",
        "answer": "b = a/c; for the supplied values, b = 6.",
        "explanation": "Divide both sides by c, assuming c is not zero: a/c = bc/c = b. Substitution gives b = 18/3 = 6. Check the original product: 6 × 3 = 18.",
        "source_ids": [
          "S3"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Starting with a = bc, isolate c. Then find c when a = 7.5 and b = 2.5.",
        "answer": "c = a/b; for the supplied values, c = 3.",
        "explanation": "Divide both sides by the nonzero factor b: c = a/b. With the supplied values, c = 7.5/2.5 = 3. Checking gives 2.5 × 3 = 7.5.",
        "source_ids": [
          "S3"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q01",
        "type": "reflection",
        "prompt": "Solve 4y = 2. Explain which operation preserves equality, then check your answer in the original equation.",
        "explain": "Divide both sides by 4: y = 2/4 = 0.5. Substituting gives 4 × 0.5 = 2, so the original equality holds. The fraction 2/4 and the decimal 0.5 describe the same value.",
        "rubric": "Expected answer: y = 0.5.\nReasoning: Divide both sides by 4: y = 2/4 = 0.5. Substituting gives 4 × 0.5 = 2, so the original equality holds. The fraction 2/4 and the decimal 0.5 describe the same value.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q02",
        "type": "reflection",
        "prompt": "Solve 6x = 3 and verify the result by multiplication.",
        "explain": "The coefficient 6 multiplies x, so divide both sides by 6: x = 3/6 = 1/2 = 0.5. The check is 6 × 0.5 = 3.",
        "rubric": "Expected answer: x = 0.5.\nReasoning: The coefficient 6 multiplies x, so divide both sides by 6: x = 3/6 = 1/2 = 0.5. The check is 6 × 0.5 = 3.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q03",
        "type": "reflection",
        "prompt": "Starting with a = bc, isolate b. Then find b when a = 18 and c = 3.",
        "explain": "Divide both sides by c, assuming c is not zero: a/c = bc/c = b. Substitution gives b = 18/3 = 6. Check the original product: 6 × 3 = 18.",
        "rubric": "Expected answer: b = a/c; for the supplied values, b = 6.\nReasoning: Divide both sides by c, assuming c is not zero: a/c = bc/c = b. Substitution gives b = 18/3 = 6. Check the original product: 6 × 3 = 18.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q04",
        "type": "reflection",
        "prompt": "Starting with a = bc, isolate c. Then find c when a = 7.5 and b = 2.5.",
        "explain": "Divide both sides by the nonzero factor b: c = a/b. With the supplied values, c = 7.5/2.5 = 3. Checking gives 2.5 × 3 = 7.5.",
        "rubric": "Expected answer: c = a/b; for the supplied values, c = 3.\nReasoning: Divide both sides by the nonzero factor b: c = a/b. With the supplied values, c = 7.5/2.5 = 3. Checking gives 2.5 × 3 = 7.5.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q05",
        "type": "reflection",
        "prompt": "A learner changes a = bc into b = c/a. Test that proposed rearrangement using a = 12 and c = 4, and give the correct rearrangement.",
        "explain": "The proposed expression gives b = 4/12 = 1/3. Substitution into the original equation gives bc = (1/3) × 4 = 4/3, not 12. Dividing the original equation by c instead gives b = a/c = 12/4 = 3, and 3 × 4 = 12.",
        "rubric": "Expected answer: The proposed rearrangement fails. The correct expression is b = a/c, giving b = 3.\nReasoning: The proposed expression gives b = 4/12 = 1/3. Substitution into the original equation gives bc = (1/3) × 4 = 4/3, not 12. Dividing the original equation by c instead gives b = a/c = 12/4 = 3, and 3 × 4 = 12.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-Q06",
        "type": "reflection",
        "prompt": "In a = bc, suppose a = 0 and c = 0. Can b be found by dividing a by c? What does the original equation tell you?",
        "explain": "The quotient a/c would be 0/0, which is undefined. Returning to the original equation gives 0 = b × 0. That equality holds for every numerical value of b, so these given values do not determine a unique b.",
        "rubric": "Expected answer: No. Division by zero is undefined, and the original equation does not determine a unique value of b.\nReasoning: The quotient a/c would be 0/0, which is undefined. Returning to the original equation gives 0 = b × 0. That equality holds for every numerical value of b, so these given values do not determine a unique b.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-P07",
        "type": "reflection",
        "prompt": "Explain the main idea from “Source anchors and review approach” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified “Equations” material on printed p. 17 describes an equation as an equality and uses letters for numerical quantities or unknowns. Its examples include a = bc, b = a/c, c = a/b, and 4y = 2. These are the source-specific anchors for this review. Equation rearrangement is a listed topic of Mathematics Companion; this connection does not establish that you have completed it. The alternative approach here pairs each rearrangement with a substitution check. The explanations and fresh practice are instructional additions, not additional transcribed book examples.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-P08",
        "type": "reflection",
        "prompt": "Use the explanation under “Read the relationship before calculating” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "An equals sign says that the expressions on its two sides have the same value. A letter names a quantity; its value may be given or may be the unknown you want to find. In a = bc, the adjacent letters bc mean b multiplied by c. The equation therefore says that a equals the product of b and c. Rearranging does not change this relationship: it expresses the same relationship with a different letter isolated. These examples supply no physical units, so treat the letters as numerical quantities rather than assigning them electrical meanings.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-P09",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Worked source example: solve and substitute”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The source example 4y = 2 means four times y equals two. To leave y by itself, undo multiplication by 4 with division by 4. Apply that operation to both sides: (4y)/4 = 2/4. Since 4/4 = 1, the left side becomes y, giving y = 2/4 = 0.5. The fraction 2/4 means two divided by four; it can also be simplified to 1/2. Now check the result in the original equation: 4 × 0.5 = 2. This check tests the answer against the starting relationship, rather than merely repeating the division.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02-R01-P10",
        "type": "reflection",
        "prompt": "How would you check that you understood “Rearrange a product into a quotient” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "For a = bc, choose which letter you want alone. To isolate b, undo its multiplication by c: divide both sides by c to obtain a/c = bc/c = b, or b = a/c. This step requires c ≠ 0. To isolate c instead, divide both sides by b: a/b = bc/b = c, or c = a/b, with b ≠ 0. Both quotient forms appear in the verified source; the nonzero conditions are mathematical qualifications explained here. Choose the divisor by identifying the factor multiplying your desired unknown, not by guessing which letter should go above the fraction bar.",
        "safety": false,
        "source_ids": [
          "S3"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "algebra",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U02",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03",
    "generated": true,
    "subtrack": "generated",
    "title": "Reading Formula Symbols and Units",
    "description": "A notation-focused lesson from Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, using verified evidence from printed pp. 19, 20 and 24. Learn to distinguish quantities from units and read symbols in context without treating the chapter’s tables as a memorization requirement.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19, 20, 24",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Separate the quantity from its unit",
        "source_ids": [
          "S18"
        ]
      },
      {
        "heading": "Shared units do not make quantities identical",
        "source_ids": [
          "S18"
        ]
      },
      {
        "heading": "Read T, f, F and C in context",
        "source_ids": [
          "S8",
          "S10"
        ]
      },
      {
        "heading": "Local definitions and reference-table limits",
        "source_ids": [
          "S10",
          "S18"
        ]
      }
    ],
    "objectives": [
      "Distinguish a symbol representing a quantity from an abbreviation naming its unit.",
      "Recognize that resistance, reactance and impedance share the ohm unit without being interchangeable quantities.",
      "Identify the chapter’s siemens entries without inferring additional circuit theory.",
      "Interpret locally defined symbols for frequency, capacitance, charge, voltage and energy.",
      "Use the Greek-symbol table as a reference while respecting the limits of the verified extraction."
    ],
    "html": "<p>A notation-focused lesson from Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, using verified evidence from printed pp. 19, 20 and 24. Learn to distinguish quantities from units and read symbols in context without treating the chapter’s tables as a memorization requirement.</p><h3>Separate the quantity from its unit</h3><p>A formula symbol represents a quantity; a unit abbreviation tells you how a value of that quantity is expressed. These are different roles, even when the same letter appears in both. The “Units for Electronics Formulas” table on printed p. 24 explicitly distinguishes formula symbols from unit abbreviations.</p><p></p><p>A useful reading method is to ask three questions: What quantity does this symbol represent here? What unit measures it? What numerical value is being supplied? Do not decide the meaning from the letter alone. Read the accompanying definition and the equation in which it appears.</p><p></p><p>This lesson uses the table as a reference tool, not a list to memorize. The verified extraction supports selected distinctions, rather than a complete transcription of every table entry. Where an individual entry is not supplied, we will not reconstruct it.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.)</p><h3>Shared units do not make quantities identical</h3><p>Printed p. 24 groups resistance, reactance and impedance under the same unit: ohms. This is a shared measurement unit, not a statement that the three quantity names mean the same thing. For example, a value identified as “5 ohms of resistance” and one identified as “5 ohms of impedance” have the same numerical value and unit, but their quantity labels remain different. This is a newly authored notation example, not a circuit calculation from the book.</p><p></p><p>The table also assigns siemens to conductance, admittance and susceptance. At this stage, recognize those three names and their shared unit; the supplied table evidence does not establish how to calculate them or how they behave in a circuit.</p><p></p><p>When reading a result, retain both the quantity label and its unit. A unit can help classify a value, but it does not always identify the quantity uniquely. This is why a clear answer needs more than an unexplained number followed by a unit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.)</p><h3>Read T, f, F and C in context</h3><p>The period-and-frequency material on printed p. 19 uses T for period and f for frequency; the source also uses capital F for frequency. Period is measured in seconds and frequency in hertz. Thus, in T = 1/f, the letters name quantities, while “seconds” and “hertz” name their units. This is a notation reading, not a requirement to perform reciprocal calculations before continuing.</p><p></p><p>Printed p. 20 supplies another important distinction: C represents capacitance in Q = CV, but the unit of charge is the coulomb, abbreviated C. Here Q is charge in coulombs, C is capacitance in farads, and V is voltage in volts. The same character can therefore serve different roles according to its position and definition. Likewise, F may represent frequency in the source’s formula notation, whereas F as a unit abbreviation means farad.</p><p></p><p>Read the locally defined meaning first. A symbol in an equation and a unit after a numerical value should not automatically receive the same interpretation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Local definitions and reference-table limits</h3><p>The clear energy definition on printed p. 20 is E = 0.5CV². In this equation, E means stored electric-field energy in joules, C means capacitance in farads, and V means voltage in volts. The squared symbol is V: the expression uses voltage multiplied by itself. This reading identifies the symbols without developing the separate lesson on capacitor energy calculations.</p><p></p><p>The extraction flags conflicting notation in the right-column energy solution, where E is used both as an energy label and inside an expression. That ambiguity remains unresolved. Use the clear definition above for this notation exercise; do not guess the meaning of every E in the disputed solution or silently repair it.</p><p></p><p>Printed p. 24 also contains a table pairing Greek uppercase and lowercase letters with their names. Use such a table to identify a character and its case, then use the surrounding formula definition to determine what quantity it represents. The verified extraction does not list the individual Greek entries, so this lesson does not reproduce or test unseen entries.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.); S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "A result is labeled “impedance: 5 ohms.” Identify the quantity, numerical value and unit. Does its unit alone establish that it is resistance?",
        "answer": "Quantity: impedance. Numerical value: 5. Unit: ohm. No—the unit alone does not establish that the quantity is resistance.",
        "explanation": "The p. 24 table assigns ohms to resistance, reactance and impedance. The quantity label therefore matters: sharing a unit does not make the quantities interchangeable.",
        "source_ids": [
          "S18"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Which shared unit does the chapter assign to conductance, admittance and susceptance? Does this table entry supply a calculation method for those quantities?",
        "answer": "Their shared unit is the siemens. No—the cited table entry identifies the unit, not a calculation method.",
        "explanation": "The verified table supports recognizing the quantity names and their unit. It does not, by itself, provide the theory or equations needed to calculate them.",
        "source_ids": [
          "S18"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Read T = 1/f as notation. What do T and f represent, and what units belong to each? How should you interpret a capital F if it appears as the source’s frequency symbol?",
        "answer": "T represents period, measured in seconds. f represents frequency, measured in hertz. A capital F defined there as frequency also represents a quantity measured in hertz; it is not automatically the farad unit.",
        "explanation": "The p. 19 material defines period and frequency as reciprocal quantities and also uses capital F for frequency. A locally defined formula symbol must be distinguished from a unit abbreviation such as F for farad.",
        "source_ids": [
          "S8",
          "S10"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "In Q = CV, identify each quantity and its unit. Explain the difference between C in the equation and C written as the unit abbreviation after a numerical charge value.",
        "answer": "Q is charge in coulombs, C is capacitance in farads, and V is voltage in volts. C inside this equation is a quantity symbol for capacitance; C after a numerical charge value is the unit abbreviation for coulomb.",
        "explanation": "The source defines capacitance in farads and charge in coulombs. In the formula, C names the capacitance quantity; as a unit abbreviation for charge, C means coulomb. Context resolves the repeated character.",
        "source_ids": [
          "S10"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-Q01",
        "type": "reflection",
        "prompt": "A result is labeled “impedance: 5 ohms.” Identify the quantity, numerical value and unit. Does its unit alone establish that it is resistance?",
        "explain": "The p. 24 table assigns ohms to resistance, reactance and impedance. The quantity label therefore matters: sharing a unit does not make the quantities interchangeable.",
        "rubric": "Expected answer: Quantity: impedance. Numerical value: 5. Unit: ohm. No—the unit alone does not establish that the quantity is resistance.\nReasoning: The p. 24 table assigns ohms to resistance, reactance and impedance. The quantity label therefore matters: sharing a unit does not make the quantities interchangeable.",
        "safety": false,
        "source_ids": [
          "S18"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-Q02",
        "type": "reflection",
        "prompt": "Which shared unit does the chapter assign to conductance, admittance and susceptance? Does this table entry supply a calculation method for those quantities?",
        "explain": "The verified table supports recognizing the quantity names and their unit. It does not, by itself, provide the theory or equations needed to calculate them.",
        "rubric": "Expected answer: Their shared unit is the siemens. No—the cited table entry identifies the unit, not a calculation method.\nReasoning: The verified table supports recognizing the quantity names and their unit. It does not, by itself, provide the theory or equations needed to calculate them.",
        "safety": false,
        "source_ids": [
          "S18"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-Q03",
        "type": "reflection",
        "prompt": "Read T = 1/f as notation. What do T and f represent, and what units belong to each? How should you interpret a capital F if it appears as the source’s frequency symbol?",
        "explain": "The p. 19 material defines period and frequency as reciprocal quantities and also uses capital F for frequency. A locally defined formula symbol must be distinguished from a unit abbreviation such as F for farad.",
        "rubric": "Expected answer: T represents period, measured in seconds. f represents frequency, measured in hertz. A capital F defined there as frequency also represents a quantity measured in hertz; it is not automatically the farad unit.\nReasoning: The p. 19 material defines period and frequency as reciprocal quantities and also uses capital F for frequency. A locally defined formula symbol must be distinguished from a unit abbreviation such as F for farad.",
        "safety": false,
        "source_ids": [
          "S8",
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-Q04",
        "type": "reflection",
        "prompt": "In Q = CV, identify each quantity and its unit. Explain the difference between C in the equation and C written as the unit abbreviation after a numerical charge value.",
        "explain": "The source defines capacitance in farads and charge in coulombs. In the formula, C names the capacitance quantity; as a unit abbreviation for charge, C means coulomb. Context resolves the repeated character.",
        "rubric": "Expected answer: Q is charge in coulombs, C is capacitance in farads, and V is voltage in volts. C inside this equation is a quantity symbol for capacitance; C after a numerical charge value is the unit abbreviation for coulomb.\nReasoning: The source defines capacitance in farads and charge in coulombs. In the formula, C names the capacitance quantity; as a unit abbreviation for charge, C means coulomb. Context resolves the repeated character.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-Q05",
        "type": "reflection",
        "prompt": "In the clear definition E = 0.5CV², what does E represent, what is its unit, and which quantity is squared? Should this definition be used to guess the meaning of every E in the source’s conflicting worked solution?",
        "explain": "The verified left-column definition uses E for energy and V for voltage. The conflicting right-column notation is unresolved, so this exercise relies only on the clear definition rather than treating an inferred correction as verified source content.",
        "rubric": "Expected answer: E represents stored electric-field energy in joules. Voltage V is squared. No—the conflicting worked-solution notation should remain flagged rather than guessed.\nReasoning: The verified left-column definition uses E for energy and V for voltage. The conflicting right-column notation is unresolved, so this exercise relies only on the clear definition rather than treating an inferred correction as verified source content.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-P06",
        "type": "reflection",
        "prompt": "Explain the main idea from “Separate the quantity from its unit” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "A formula symbol represents a quantity; a unit abbreviation tells you how a value of that quantity is expressed. These are different roles, even when the same letter appears in both. The “Units for Electronics Formulas” table on printed p. 24 explicitly distinguishes formula symbols from unit abbreviations.\n\nA useful reading method is to ask three questions: What quantity does this symbol represent here? What unit measures it? What numerical value is being supplied? Do not decide the meaning from the letter alone. Read the accompanying definition and the equation in which it appears.\n\nThis lesson uses the table as a reference tool, not a list to memorize. The verified extraction supports selected distinctions, rather than a complete transcription of every table entry. Where an individual entry is not supplied, we will not reconstruct it.",
        "safety": false,
        "source_ids": [
          "S18"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-P07",
        "type": "reflection",
        "prompt": "Use the explanation under “Shared units do not make quantities identical” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Printed p. 24 groups resistance, reactance and impedance under the same unit: ohms. This is a shared measurement unit, not a statement that the three quantity names mean the same thing. For example, a value identified as “5 ohms of resistance” and one identified as “5 ohms of impedance” have the same numerical value and unit, but their quantity labels remain different. This is a newly authored notation example, not a circuit calculation from the book.\n\nThe table also assigns siemens to conductance, admittance and susceptance. At this stage, recognize those three names and their shared unit; the supplied table evidence does not establish how to calculate them or how they behave in a circuit.\n\nWhen reading a result, retain both the quantity label and its unit. A unit can help classify a value, but it does not always identify the quantity uniquely. This is why a clear answer needs more than an unexplained number followed by a unit.",
        "safety": false,
        "source_ids": [
          "S18"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-P08",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Read T, f, F and C in context”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The period-and-frequency material on printed p. 19 uses T for period and f for frequency; the source also uses capital F for frequency. Period is measured in seconds and frequency in hertz. Thus, in T = 1/f, the letters name quantities, while “seconds” and “hertz” name their units. This is a notation reading, not a requirement to perform reciprocal calculations before continuing.\n\nPrinted p. 20 supplies another important distinction: C represents capacitance in Q = CV, but the unit of charge is the coulomb, abbreviated C. Here Q is charge in coulombs, C is capacitance in farads, and V is voltage in volts. The same character can therefore serve different roles according to its position and definition. Likewise, F may represent frequency in the source’s formula notation, whereas F as a unit abbreviation means farad.\n\nRead the locally defined meaning first. A symbol in an equation and a unit after a numerical value should not automatically receive the same interpretation.",
        "safety": false,
        "source_ids": [
          "S8",
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-P09",
        "type": "reflection",
        "prompt": "How would you check that you understood “Local definitions and reference-table limits” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The clear energy definition on printed p. 20 is E = 0.5CV². In this equation, E means stored electric-field energy in joules, C means capacitance in farads, and V means voltage in volts. The squared symbol is V: the expression uses voltage multiplied by itself. This reading identifies the symbols without developing the separate lesson on capacitor energy calculations.\n\nThe extraction flags conflicting notation in the right-column energy solution, where E is used both as an energy label and inside an expression. That ambiguity remains unresolved. Use the clear definition above for this notation exercise; do not guess the meaning of every E in the disputed solution or silently repair it.\n\nPrinted p. 24 also contains a table pairing Greek uppercase and lowercase letters with their names. Use such a table to identify a character and its case, then use the surrounding formula definition to determine what quantity it represents. The verified extraction does not list the individual Greek entries, so this lesson does not reproduce or test unseen entries.",
        "safety": false,
        "source_ids": [
          "S10",
          "S18"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03-P10",
        "type": "reflection",
        "prompt": "Explain the main idea from “Separate the quantity from its unit” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "A formula symbol represents a quantity; a unit abbreviation tells you how a value of that quantity is expressed. These are different roles, even when the same letter appears in both. The “Units for Electronics Formulas” table on printed p. 24 explicitly distinguishes formula symbols from unit abbreviations.\n\nA useful reading method is to ask three questions: What quantity does this symbol represent here? What unit measures it? What numerical value is being supplied? Do not decide the meaning from the letter alone. Read the accompanying definition and the equation in which it appears.\n\nThis lesson uses the table as a reference tool, not a list to memorize. The verified extraction supports selected distinctions, rather than a complete transcription of every table entry. Where an individual entry is not supplied, we will not reconstruct it.",
        "safety": false,
        "source_ids": [
          "S18"
        ]
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "concept",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U03",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "reviews",
      "source_id": "book-associate-cet-study-guide",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01",
    "generated": true,
    "subtrack": "generated",
    "title": "Select a Formula, Then Verify by Another Route",
    "description": "Replace formula-wheel guessing with a known-quantity inventory and an independent calculation route. The source-specific contribution is the p. 17 Ohm’s law memory aid and the accepted p. 18 power relations; the algebraic links, cross-check workflow and fresh resistor exercises are reinforcement rather than new source concepts.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17, 18",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Review approach and source boundaries",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Choose by the known quantities",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Link the power formulas explicitly",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Worked method: calculate directly, then cross-check",
        "source_ids": [
          "S4",
          "S5"
        ]
      }
    ],
    "objectives": [],
    "html": "<p>Replace formula-wheel guessing with a known-quantity inventory and an independent calculation route. The source-specific contribution is the p. 17 Ohm’s law memory aid and the accepted p. 18 power relations; the algebraic links, cross-check workflow and fresh resistor exercises are reinforcement rather than new source concepts.</p><h3>Review approach and source boundaries</h3><p>The source-specific anchors for this review are the Ohm’s law equations and Figure 1 on printed p. 17, followed by the readable power relations and Figures 2–3 on printed p. 18. Figure 1 places V above I and R as a memory aid; Figure 3 collects related voltage, current, resistance and power formulas. The supplied Electrical foundations lesson lists these topics, but that does not establish learner completion or mastery.</p><p></p><p>The alternative worked method here is to list the known quantities, choose an equation containing them and the desired unknown, and then check the answer through a different relation. That workflow and all numerical exercises below are newly authored reinforcement, not transcribed source problems. The extraction flags disputed power-law prose on p. 18; this review uses only the accepted equations and does not reconstruct the disputed expressions.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Choose by the known quantities</h3><p>Define the letters before selecting a formula: V is voltage in volts (V), I is current in amperes (A), R is resistance in ohms (Ω), and P is power in watts (W). Use numerical values expressed in those units for the calculations here. These are written resistor calculations, not measurement or construction instructions.</p><p></p><p>On printed p. 17, Ohm’s law gives V = IR, I = V/R and R = V/I. With current and resistance known, multiply to find voltage. With voltage and one other quantity known, divide to find the remaining quantity. The triangular memory aid can help recall this pattern, but an equation also explains it: starting from V = IR, dividing both sides by nonzero R gives V/R = I; dividing by nonzero I gives V/I = R.</p><p></p><p>Keep the requested quantity visible beside your work. V/R produces current in amperes, not power in watts. A unit label is part of the answer, not a decoration added after calculating.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Link the power formulas explicitly</h3><p>The readable power relations on printed p. 18 are P = IV, P = I²R and P = V²/R, along with V = P/I and I = P/V. Select P = IV when current and voltage are known; P = I²R when current and resistance are known; and P = V²/R when voltage and resistance are known. The resistance-based expressions are used here for resistors, not generalized to arbitrary reactive AC loads.</p><p></p><p>These formulas connect rather than compete. Substituting V = IR into P = IV gives P = I(IR) = I²R. Substituting I = V/R gives P = (V/R)V = V²/R. This algebraic explanation is instructional reinforcement based on the verified relations.</p><p></p><p>Respect the order of operations: in I²R, square the current before multiplying by resistance; in V²/R, square the voltage before dividing. I²R does not mean (IR)². For the quotient forms, the divisor must be nonzero.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Worked method: calculate directly, then cross-check</h3><p>Newly authored worked example using the verified relations: a 100 Ω resistor has 5 V across it. Find its current and power. The known quantities are V = 5 V and R = 100 Ω; the unknowns are I and P.</p><p></p><p>First choose I = V/R, because it contains both given quantities: I = 5 V / 100 Ω = 0.05 A. For power, use the direct voltage-and-resistance relation: P = V²/R = (5)²/100 W = 25/100 W = 0.25 W.</p><p></p><p>Now check through a different route using the calculated current: P = IV = 0.05 × 5 W = 0.25 W. A further check gives I²R = (0.05)² × 100 W = 0.0025 × 100 W = 0.25 W. The results agree. These checks can reveal an incorrect square or a mistaken formula, although agreement alone cannot prove that the original input values were correct.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "A resistor has 12 V across it and carries 0.25 A. Find its resistance and power. Check the power using a second formula.",
        "answer": "R = 48 Ω; P = 3 W.",
        "explanation": "Use the two given quantities directly: R = V/I = 12/0.25 = 48 Ω, and P = IV = 0.25 × 12 = 3 W. With the calculated resistance, P = V²/R = 12²/48 = 144/48 = 3 W. Agreement supports the arithmetic and formula selection.",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "A 200 Ω resistor carries 0.03 A. Find its voltage and power. Show the square in the power calculation.",
        "answer": "V = 6 V; P = 0.18 W.",
        "explanation": "Ohm’s law gives V = IR = 0.03 × 200 = 6 V. Because current and resistance are given, use P = I²R: (0.03)² × 200 = 0.0009 × 200 = 0.18 W. Check with P = IV = 0.03 × 6 = 0.18 W. Squaring 0.03 gives 0.0009, not 0.09.",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "There is 9 V across a 300 Ω resistor. Find its current and power without using a square root.",
        "answer": "I = 0.03 A; P = 0.27 W.",
        "explanation": "Use I = V/R = 9/300 = 0.03 A. The direct power relation for voltage and resistance is P = V²/R = 9²/300 = 81/300 = 0.27 W. Alternatively, P = IV = 0.03 × 9 = 0.27 W. No square-root rearrangement is needed.",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A resistor dissipates 2 W with 10 V across it. Find its current, then its resistance.",
        "answer": "I = 0.2 A; R = 50 Ω.",
        "explanation": "The verified power quotient is I = P/V, so I = 2/10 = 0.2 A. Then R = V/I = 10/0.2 = 50 Ω. Check with P = I²R = (0.2)² × 50 = 0.04 × 50 = 2 W.",
        "source_ids": [
          "S4",
          "S5"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q01",
        "type": "reflection",
        "prompt": "A resistor has 12 V across it and carries 0.25 A. Find its resistance and power. Check the power using a second formula.",
        "explain": "Use the two given quantities directly: R = V/I = 12/0.25 = 48 Ω, and P = IV = 0.25 × 12 = 3 W. With the calculated resistance, P = V²/R = 12²/48 = 144/48 = 3 W. Agreement supports the arithmetic and formula selection.",
        "rubric": "Expected answer: R = 48 Ω; P = 3 W.\nReasoning: Use the two given quantities directly: R = V/I = 12/0.25 = 48 Ω, and P = IV = 0.25 × 12 = 3 W. With the calculated resistance, P = V²/R = 12²/48 = 144/48 = 3 W. Agreement supports the arithmetic and formula selection.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q02",
        "type": "reflection",
        "prompt": "A 200 Ω resistor carries 0.03 A. Find its voltage and power. Show the square in the power calculation.",
        "explain": "Ohm’s law gives V = IR = 0.03 × 200 = 6 V. Because current and resistance are given, use P = I²R: (0.03)² × 200 = 0.0009 × 200 = 0.18 W. Check with P = IV = 0.03 × 6 = 0.18 W. Squaring 0.03 gives 0.0009, not 0.09.",
        "rubric": "Expected answer: V = 6 V; P = 0.18 W.\nReasoning: Ohm’s law gives V = IR = 0.03 × 200 = 6 V. Because current and resistance are given, use P = I²R: (0.03)² × 200 = 0.0009 × 200 = 0.18 W. Check with P = IV = 0.03 × 6 = 0.18 W. Squaring 0.03 gives 0.0009, not 0.09.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q03",
        "type": "reflection",
        "prompt": "There is 9 V across a 300 Ω resistor. Find its current and power without using a square root.",
        "explain": "Use I = V/R = 9/300 = 0.03 A. The direct power relation for voltage and resistance is P = V²/R = 9²/300 = 81/300 = 0.27 W. Alternatively, P = IV = 0.03 × 9 = 0.27 W. No square-root rearrangement is needed.",
        "rubric": "Expected answer: I = 0.03 A; P = 0.27 W.\nReasoning: Use I = V/R = 9/300 = 0.03 A. The direct power relation for voltage and resistance is P = V²/R = 9²/300 = 81/300 = 0.27 W. Alternatively, P = IV = 0.03 × 9 = 0.27 W. No square-root rearrangement is needed.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q04",
        "type": "reflection",
        "prompt": "A resistor dissipates 2 W with 10 V across it. Find its current, then its resistance.",
        "explain": "The verified power quotient is I = P/V, so I = 2/10 = 0.2 A. Then R = V/I = 10/0.2 = 50 Ω. Check with P = I²R = (0.2)² × 50 = 0.04 × 50 = 2 W.",
        "rubric": "Expected answer: I = 0.2 A; R = 50 Ω.\nReasoning: The verified power quotient is I = P/V, so I = 2/10 = 0.2 A. Then R = V/I = 10/0.2 = 50 Ω. Check with P = I²R = (0.2)² × 50 = 0.04 × 50 = 2 W.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q05",
        "type": "reflection",
        "prompt": "A resistor dissipates 0.6 W while carrying 0.1 A. Find its voltage and resistance, then check the power.",
        "explain": "Use V = P/I = 0.6/0.1 = 6 V. Next, R = V/I = 6/0.1 = 60 Ω. The check is P = V²/R = 36/60 = 0.6 W. Dividing by 0.1 increases the numerical value by a factor of ten; it is not the same as multiplying by 0.1.",
        "rubric": "Expected answer: V = 6 V; R = 60 Ω.\nReasoning: Use V = P/I = 0.6/0.1 = 6 V. Next, R = V/I = 6/0.1 = 60 Ω. The check is P = V²/R = 36/60 = 0.6 W. Dividing by 0.1 increases the numerical value by a factor of ten; it is not the same as multiplying by 0.1.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-Q06",
        "type": "reflection",
        "prompt": "For 8 V across a 4 Ω resistor, a learner writes P = V/R = 2 W. Identify the mistake and calculate both current and power correctly.",
        "explain": "V/R is the Ohm’s law expression for current, not power. Thus I = 8/4 = 2 A. For power, use P = V²/R = 8²/4 = 64/4 = 16 W, or P = IV = 2 × 8 = 16 W. A correct numerical division does not make the selected formula or output unit correct.",
        "rubric": "Expected answer: The learner calculated current and mislabeled it as power. I = 2 A; P = 16 W.\nReasoning: V/R is the Ohm’s law expression for current, not power. Thus I = 8/4 = 2 A. For power, use P = V²/R = 8²/4 = 64/4 = 16 W, or P = IV = 2 × 8 = 16 W. A correct numerical division does not make the selected formula or output unit correct.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-P07",
        "type": "reflection",
        "prompt": "Explain the main idea from “Review approach and source boundaries” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The source-specific anchors for this review are the Ohm’s law equations and Figure 1 on printed p. 17, followed by the readable power relations and Figures 2–3 on printed p. 18. Figure 1 places V above I and R as a memory aid; Figure 3 collects related voltage, current, resistance and power formulas. The supplied Electrical foundations lesson lists these topics, but that does not establish learner completion or mastery.\n\nThe alternative worked method here is to list the known quantities, choose an equation containing them and the desired unknown, and then check the answer through a different relation. That workflow and all numerical exercises below are newly authored reinforcement, not transcribed source problems. The extraction flags disputed power-law prose on p. 18; this review uses only the accepted equations and does not reconstruct the disputed expressions.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-P08",
        "type": "reflection",
        "prompt": "Use the explanation under “Choose by the known quantities” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Define the letters before selecting a formula: V is voltage in volts (V), I is current in amperes (A), R is resistance in ohms (Ω), and P is power in watts (W). Use numerical values expressed in those units for the calculations here. These are written resistor calculations, not measurement or construction instructions.\n\nOn printed p. 17, Ohm’s law gives V = IR, I = V/R and R = V/I. With current and resistance known, multiply to find voltage. With voltage and one other quantity known, divide to find the remaining quantity. The triangular memory aid can help recall this pattern, but an equation also explains it: starting from V = IR, dividing both sides by nonzero R gives V/R = I; dividing by nonzero I gives V/I = R.\n\nKeep the requested quantity visible beside your work. V/R produces current in amperes, not power in watts. A unit label is part of the answer, not a decoration added after calculating.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-P09",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Link the power formulas explicitly”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The readable power relations on printed p. 18 are P = IV, P = I²R and P = V²/R, along with V = P/I and I = P/V. Select P = IV when current and voltage are known; P = I²R when current and resistance are known; and P = V²/R when voltage and resistance are known. The resistance-based expressions are used here for resistors, not generalized to arbitrary reactive AC loads.\n\nThese formulas connect rather than compete. Substituting V = IR into P = IV gives P = I(IR) = I²R. Substituting I = V/R gives P = (V/R)V = V²/R. This algebraic explanation is instructional reinforcement based on the verified relations.\n\nRespect the order of operations: in I²R, square the current before multiplying by resistance; in V²/R, square the voltage before dividing. I²R does not mean (IR)². For the quotient forms, the divisor must be nonzero.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04-R01-P10",
        "type": "reflection",
        "prompt": "How would you check that you understood “Worked method: calculate directly, then cross-check” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Newly authored worked example using the verified relations: a 100 Ω resistor has 5 V across it. Find its current and power. The known quantities are V = 5 V and R = 100 Ω; the unknowns are I and P.\n\nFirst choose I = V/R, because it contains both given quantities: I = 5 V / 100 Ω = 0.05 A. For power, use the direct voltage-and-resistance relation: P = V²/R = (5)²/100 W = 25/100 W = 0.25 W.\n\nNow check through a different route using the calculated current: P = IV = 0.05 × 5 W = 0.25 W. A further check gives I²R = (0.05)² × 100 W = 0.0025 × 100 W = 0.25 W. The results agree. These checks can reveal an incorrect square or a mistaken formula, although agreement alone cannot prove that the original input values were correct.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "ohm",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U04",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "reviews",
      "source_id": "book-associate-cet-study-guide",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01",
    "generated": true,
    "subtrack": "generated",
    "title": "Resistor Totals: Reciprocal Stages and Magnitude Checks",
    "description": "Use a written two-stage reciprocal workflow and formula-derived magnitude checks instead of repeating a measurement activity. The actual source contribution is the three verified total-resistance rules on p. 19; the worked numbers, reciprocal-unit tracking, error diagnosis and plausibility checks are instructional reinforcement, not additional extracted source examples.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Source anchors and a calculation-focused review",
        "source_ids": [
          "S9"
        ]
      },
      {
        "heading": "Series: add values and inspect the sum",
        "source_ids": [
          "S9"
        ]
      },
      {
        "heading": "Parallel: keep the two reciprocal stages separate",
        "source_ids": [
          "S9"
        ]
      },
      {
        "heading": "Equal parallel resistors: derive and verify the shortcut",
        "source_ids": [
          "S9"
        ]
      }
    ],
    "objectives": [],
    "html": "<p>Use a written two-stage reciprocal workflow and formula-derived magnitude checks instead of repeating a measurement activity. The actual source contribution is the three verified total-resistance rules on p. 19; the worked numbers, reciprocal-unit tracking, error diagnosis and plausibility checks are instructional reinforcement, not additional extracted source examples.</p><h3>Source anchors and a calculation-focused review</h3><p>The verified material in the lower-left column of printed p. 19 gives three calculation rules: add resistances in series, take the reciprocal of the sum of reciprocals in parallel, and use R/n for equal parallel resistors. These rules are the source-specific anchors of this review; the extraction supplies no numerical worked example for this item.</p><p></p><p>The supplied lesson list includes a Series and parallel virtual laboratory. This review takes a different approach: written calculations with an intermediate-value check and a final magnitude check. It does not assume that you have completed the laboratory. All numerical examples and questions below are newly authored applications of the verified rules, not transcribed book exercises.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Series: add values and inspect the sum</h3><p>Let R_T mean total resistance and R_1, R_2, …, R_n mean the individual resistances. Resistance is expressed here in ohms, abbreviated Ω; n is the number of resistors. Use values in the same unit before combining them. The examples assume positive resistor values and the stated series or parallel arrangement.</p><p></p><p>For series resistors, the source gives R_T = R_1 + R_2 + … + R_n. Newly authored worked example: for 100 Ω, 220 Ω and 330 Ω in series, R_T = 100 + 220 + 330 = 650 Ω. Each term is a resistance, so the sum remains in ohms.</p><p></p><p>As a check derived from this formula, adding positive resistances must give a total larger than any one of them when more than one resistor is present. A result below 330 Ω would therefore be incompatible with this example&#39;s series calculation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Parallel: keep the two reciprocal stages separate</h3><p>For parallel resistors, the source gives R_T = 1/(1/R_1 + 1/R_2 + … + 1/R_n). A reciprocal means one divided by a value. Calculate each reciprocal, add those results, and only then take the reciprocal of the whole sum.</p><p></p><p>Newly authored worked example: put 300 Ω and 600 Ω in parallel. First, 1/R_T = 1/300 + 1/600. Using a common denominator makes the arithmetic exact: 1/300 = 2/600, so 1/R_T = 3/600 = 1/200 Ω^-1. Now invert: R_T = 200 Ω.</p><p></p><p>The intermediate reciprocal sum has units Ω^-1, not Ω. Reporting it as the resistance would omit the final operation. For two or more positive parallel resistances, the sum of reciprocals exceeds the reciprocal of the smallest resistance. Its reciprocal must therefore be smaller than that smallest resistance. Here, 200 Ω is below 300 Ω, as expected.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Equal parallel resistors: derive and verify the shortcut</h3><p>For n equal parallel resistors, the source supplies the shortcut R_T = R/n, where R is the resistance of each resistor. It follows directly from the general rule: adding n copies of 1/R gives n/R, and taking the reciprocal gives R/n.</p><p></p><p>Newly authored worked example: three equal 900 Ω resistors in parallel give R_T = 900/3 = 300 Ω. The full calculation agrees: 1/R_T = 1/900 + 1/900 + 1/900 = 3/900 Ω^-1, followed by R_T = 900/3 Ω.</p><p></p><p>Before using this shortcut, check that every branch resistance is equal. For unequal values, return to the reciprocal sum rather than dividing one selected resistance by the number of branches. After either method, check that the parallel total is below the smallest branch resistance. A plausible magnitude supports the calculation, but it does not replace the calculation or verify the stated connection.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Resistors of 120 Ω, 330 Ω and 550 Ω are connected in series. Calculate the total and give a magnitude check.",
        "answer": "R_T = 1000 Ω, which is greater than every individual resistance.",
        "explanation": "Series resistances add: R_T = 120 + 330 + 550 = 1000 Ω. For these positive values, the sum is greater than the largest individual resistance, 550 Ω.",
        "source_ids": [
          "S9"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Calculate the total of 200 Ω and 300 Ω in parallel. Show the reciprocal sum before taking its reciprocal.",
        "answer": "R_T = 120 Ω.",
        "explanation": "1/R_T = 1/200 + 1/300 = 0.005 + 0.003333… = 0.008333… Ω^-1. Taking the reciprocal gives R_T = 120 Ω. Keep enough intermediate digits to avoid unnecessary rounding error. The result is below 200 Ω, the smaller branch resistance.",
        "source_ids": [
          "S9"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Three resistors, 100 Ω, 200 Ω and 400 Ω, are connected in parallel. Find their total resistance, rounded to one decimal place.",
        "answer": "R_T ≈ 57.1 Ω.",
        "explanation": "The reciprocal sum is 1/100 + 1/200 + 1/400 = 0.01 + 0.005 + 0.0025 = 0.0175 Ω^-1. Therefore R_T = 1/0.0175 = 57.142857… Ω, or approximately 57.1 Ω. It is smaller than the smallest branch resistance, 100 Ω.",
        "source_ids": [
          "S9"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Four equal 680 Ω resistors are connected in parallel. Use the equal-resistor shortcut and check it with the reciprocal formula.",
        "answer": "R_T = 170 Ω.",
        "explanation": "For n equal parallel resistors, R_T = R/n = 680/4 = 170 Ω. The full formula gives 1/R_T = 4/680 Ω^-1, so R_T = 680/4 Ω again. The shortcut applies because all four resistances are equal.",
        "source_ids": [
          "S9"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q01",
        "type": "reflection",
        "prompt": "Resistors of 120 Ω, 330 Ω and 550 Ω are connected in series. Calculate the total and give a magnitude check.",
        "explain": "Series resistances add: R_T = 120 + 330 + 550 = 1000 Ω. For these positive values, the sum is greater than the largest individual resistance, 550 Ω.",
        "rubric": "Expected answer: R_T = 1000 Ω, which is greater than every individual resistance.\nReasoning: Series resistances add: R_T = 120 + 330 + 550 = 1000 Ω. For these positive values, the sum is greater than the largest individual resistance, 550 Ω.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q02",
        "type": "reflection",
        "prompt": "Calculate the total of 200 Ω and 300 Ω in parallel. Show the reciprocal sum before taking its reciprocal.",
        "explain": "1/R_T = 1/200 + 1/300 = 0.005 + 0.003333… = 0.008333… Ω^-1. Taking the reciprocal gives R_T = 120 Ω. Keep enough intermediate digits to avoid unnecessary rounding error. The result is below 200 Ω, the smaller branch resistance.",
        "rubric": "Expected answer: R_T = 120 Ω.\nReasoning: 1/R_T = 1/200 + 1/300 = 0.005 + 0.003333… = 0.008333… Ω^-1. Taking the reciprocal gives R_T = 120 Ω. Keep enough intermediate digits to avoid unnecessary rounding error. The result is below 200 Ω, the smaller branch resistance.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q03",
        "type": "reflection",
        "prompt": "Three resistors, 100 Ω, 200 Ω and 400 Ω, are connected in parallel. Find their total resistance, rounded to one decimal place.",
        "explain": "The reciprocal sum is 1/100 + 1/200 + 1/400 = 0.01 + 0.005 + 0.0025 = 0.0175 Ω^-1. Therefore R_T = 1/0.0175 = 57.142857… Ω, or approximately 57.1 Ω. It is smaller than the smallest branch resistance, 100 Ω.",
        "rubric": "Expected answer: R_T ≈ 57.1 Ω.\nReasoning: The reciprocal sum is 1/100 + 1/200 + 1/400 = 0.01 + 0.005 + 0.0025 = 0.0175 Ω^-1. Therefore R_T = 1/0.0175 = 57.142857… Ω, or approximately 57.1 Ω. It is smaller than the smallest branch resistance, 100 Ω.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q04",
        "type": "reflection",
        "prompt": "Four equal 680 Ω resistors are connected in parallel. Use the equal-resistor shortcut and check it with the reciprocal formula.",
        "explain": "For n equal parallel resistors, R_T = R/n = 680/4 = 170 Ω. The full formula gives 1/R_T = 4/680 Ω^-1, so R_T = 680/4 Ω again. The shortcut applies because all four resistances are equal.",
        "rubric": "Expected answer: R_T = 170 Ω.\nReasoning: For n equal parallel resistors, R_T = R/n = 680/4 = 170 Ω. The full formula gives 1/R_T = 4/680 Ω^-1, so R_T = 680/4 Ω again. The shortcut applies because all four resistances are equal.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q05",
        "type": "reflection",
        "prompt": "A learner calculates 1/100 + 1/100 = 0.02 and reports that two 100 Ω parallel resistors total 0.02 Ω. Identify the omitted step and correct the answer.",
        "explain": "The sum 0.02 has units Ω^-1 and represents 1/R_T, not R_T. Take its reciprocal: R_T = 1/0.02 = 50 Ω. The equal-resistor shortcut confirms this: 100/2 = 50 Ω.",
        "rubric": "Expected answer: The final reciprocal was omitted. The correct total is 50 Ω.\nReasoning: The sum 0.02 has units Ω^-1 and represents 1/R_T, not R_T. Take its reciprocal: R_T = 1/0.02 = 50 Ω. The equal-resistor shortcut confirms this: 100/2 = 50 Ω.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-Q06",
        "type": "reflection",
        "prompt": "Compare two 150 Ω resistors connected in series with the same two values connected in parallel. Find both totals and explain why adding the values is not valid for both arrangements.",
        "explain": "Series uses direct addition: 150 + 150 = 300 Ω. Equal parallel resistors use R/n: 150/2 = 75 Ω. The source gives different rules for the two arrangements; adding branch resistances in parallel would apply the series rule to the wrong connection.",
        "rubric": "Expected answer: Series: 300 Ω. Parallel: 75 Ω. The connection determines which total-resistance rule applies.\nReasoning: Series uses direct addition: 150 + 150 = 300 Ω. Equal parallel resistors use R/n: 150/2 = 75 Ω. The source gives different rules for the two arrangements; adding branch resistances in parallel would apply the series rule to the wrong connection.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-P07",
        "type": "reflection",
        "prompt": "Explain the main idea from “Source anchors and a calculation-focused review” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified material in the lower-left column of printed p. 19 gives three calculation rules: add resistances in series, take the reciprocal of the sum of reciprocals in parallel, and use R/n for equal parallel resistors. These rules are the source-specific anchors of this review; the extraction supplies no numerical worked example for this item.\n\nThe supplied lesson list includes a Series and parallel virtual laboratory. This review takes a different approach: written calculations with an intermediate-value check and a final magnitude check. It does not assume that you have completed the laboratory. All numerical examples and questions below are newly authored applications of the verified rules, not transcribed book exercises.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-P08",
        "type": "reflection",
        "prompt": "Use the explanation under “Series: add values and inspect the sum” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Let R_T mean total resistance and R_1, R_2, …, R_n mean the individual resistances. Resistance is expressed here in ohms, abbreviated Ω; n is the number of resistors. Use values in the same unit before combining them. The examples assume positive resistor values and the stated series or parallel arrangement.\n\nFor series resistors, the source gives R_T = R_1 + R_2 + … + R_n. Newly authored worked example: for 100 Ω, 220 Ω and 330 Ω in series, R_T = 100 + 220 + 330 = 650 Ω. Each term is a resistance, so the sum remains in ohms.\n\nAs a check derived from this formula, adding positive resistances must give a total larger than any one of them when more than one resistor is present. A result below 330 Ω would therefore be incompatible with this example's series calculation.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-P09",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Parallel: keep the two reciprocal stages separate”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "For parallel resistors, the source gives R_T = 1/(1/R_1 + 1/R_2 + … + 1/R_n). A reciprocal means one divided by a value. Calculate each reciprocal, add those results, and only then take the reciprocal of the whole sum.\n\nNewly authored worked example: put 300 Ω and 600 Ω in parallel. First, 1/R_T = 1/300 + 1/600. Using a common denominator makes the arithmetic exact: 1/300 = 2/600, so 1/R_T = 3/600 = 1/200 Ω^-1. Now invert: R_T = 200 Ω.\n\nThe intermediate reciprocal sum has units Ω^-1, not Ω. Reporting it as the resistance would omit the final operation. For two or more positive parallel resistances, the sum of reciprocals exceeds the reciprocal of the smallest resistance. Its reciprocal must therefore be smaller than that smallest resistance. Here, 200 Ω is below 300 Ω, as expected.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05-R01-P10",
        "type": "reflection",
        "prompt": "How would you check that you understood “Equal parallel resistors: derive and verify the shortcut” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "For n equal parallel resistors, the source supplies the shortcut R_T = R/n, where R is the resistance of each resistor. It follows directly from the general rule: adding n copies of 1/R gives n/R, and taking the reciprocal gives R/n.\n\nNewly authored worked example: three equal 900 Ω resistors in parallel give R_T = 900/3 = 300 Ω. The full calculation agrees: 1/R_T = 1/900 + 1/900 + 1/900 = 3/900 Ω^-1, followed by R_T = 900/3 Ω.\n\nBefore using this shortcut, check that every branch resistance is equal. For unequal values, return to the reciprocal sum rather than dividing one selected resistance by the number of branches. After either method, check that the parallel total is below the smallest branch resistance. A plausible magnitude supports the calculation, but it does not replace the calculation or verify the stated connection.",
        "safety": false,
        "source_ids": [
          "S9"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "network",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U05",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06",
    "generated": true,
    "subtrack": "generated",
    "title": "Battery EMF, Internal Resistance and Terminal Voltage",
    "description": "A lesson on the battery’s internal-resistance model, grounded in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 18–19. Distinguish EMF from loaded terminal voltage, reproduce the verified current calculation, and use newly authored paper exercises to connect current with internal voltage drop.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17, 18, 19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Two voltages in the battery model",
        "source_ids": [
          "S6"
        ]
      },
      {
        "heading": "Find current from the complete series resistance",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "heading": "Verified source example: 1.5 V and 6.25 Ω",
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "heading": "From internal drop to loaded terminal voltage",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      }
    ],
    "objectives": [
      "Distinguish battery EMF from the voltage available at its terminals under load.",
      "Interpret internal resistance and load resistance as series parts of the battery model.",
      "Calculate load current using the sum of external and internal resistance.",
      "Calculate internal voltage drop and loaded terminal voltage within the stated model.",
      "Explain how load current affects terminal voltage without treating the simple model as a complete description of a real battery."
    ],
    "html": "<p>A lesson on the battery’s internal-resistance model, grounded in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 18–19. Distinguish EMF from loaded terminal voltage, reproduce the verified current calculation, and use newly authored paper exercises to connect current with internal voltage drop.</p><h3>Two voltages in the battery model</h3><p>The “Internal Resistance” material on printed p. 18, including Figure 4, models a battery as an EMF together with an internal resistance in series with the external load. EMF is the source voltage in this model, measured in volts; despite its name, electromotive force is a voltage, not a mechanical force. Internal resistance represents resistance within the source. The load is the external resistance supplied by the circuit connected to the battery.</p><p></p><p>Define the symbols locally: use EMF for source voltage, r_int for internal resistance in ohms (Ω), R_ext for external load resistance in ohms, and I for current in amperes (A). Terminal voltage, V_terminal, is the voltage available across the external load.</p><p></p><p>The important new distinction is that EMF and loaded terminal voltage need not be equal. The source explains that current produces a voltage drop across internal resistance, leaving less voltage at the terminals. This lesson develops that stated model; it does not claim that one fixed internal-resistance value completely describes every real battery.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.)</p><h3>Find current from the complete series resistance</h3><p>Because the internal resistance and external load are in series, include both when finding the resistance that limits current. The series rule on printed p. 19 gives R_total = R_ext + r_int. Ohm’s law on printed p. 17 then gives I = EMF/R_total, so the battery-model expression is I = EMF/(R_ext + r_int).</p><p></p><p>Use resistance values in the same unit before adding them. With EMF in volts and resistance in ohms, the calculated current is in amperes. These calculations assume a resistive load and fixed EMF and resistance values for the example.</p><p></p><p>Do not substitute EMF into I = EMF/R_ext while ignoring a specified internal resistance. That would give all of the source voltage to the load, contrary to the model. For a positive internal resistance, the denominator R_ext + r_int is larger than R_ext alone, so the calculated current is smaller. This comparison is a consequence of the verified series and Ohm’s law relations.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Verified source example: 1.5 V and 6.25 Ω</h3><p>The verified example spanning printed pp. 18–19 uses an EMF of 1.5 V and a combined external-plus-internal resistance of 6.25 Ω. Substitute the complete resistance into the battery-model equation:</p><p></p><p>I = EMF/(R_ext + r_int)</p><p>I = 1.5 V/6.25 Ω</p><p>I = 0.24 A = 240 mA.</p><p></p><p>The last conversion expresses the same current in milliamperes: 0.24 A multiplied by 1000 mA/A is 240 mA. A substitution check gives I × R_total = 0.24 × 6.25 = 1.5 V, recovering the stated EMF.</p><p></p><p>The accepted extraction supports the combined 6.25 Ω value, but does not supply separate internal and external resistance values for this worked example. Consequently, this evidence is enough to reproduce the current, but not to calculate a separate numerical internal drop or terminal voltage. Do not invent a split of the 6.25 Ω and attribute it to the book. The next section uses explicitly newly authored values to demonstrate that additional calculation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>From internal drop to loaded terminal voltage</h3><p>Apply Ohm’s law to each resistance in the source’s series model. The internal voltage drop is V_drop = I r_int. The remaining terminal voltage is V_terminal = EMF − I r_int. It also equals the load voltage, I R_ext. These equations express the source’s explanation of internal drop using the verified Ohm’s law relationship.</p><p></p><p>Newly authored worked example: let EMF = 3 V, r_int = 1 Ω, and R_ext = 5 Ω. First, R_total = 5 + 1 = 6 Ω. Then I = 3/6 = 0.5 A. The internal drop is 0.5 × 1 = 0.5 V, so V_terminal = 3 − 0.5 = 2.5 V. Check independently across the load: I R_ext = 0.5 × 5 = 2.5 V. Finally, 0.5 V + 2.5 V = 3 V, accounting for the source voltage.</p><p></p><p>For fixed EMF and internal resistance, a larger current produces a larger internal drop and therefore a lower terminal voltage. If current is zero, this model gives zero internal drop and terminal voltage equal to EMF. These are consequences of the model, not a practical battery-testing procedure.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Explain why a battery’s terminal voltage can be lower than its EMF when it supplies a resistive load. Identify where the difference in voltage appears in the model.",
        "answer": "Load current causes a voltage drop across the battery’s internal resistance. That internal drop accounts for the difference between EMF and loaded terminal voltage.",
        "explanation": "The internal resistance is in series with the external load. Applying Ohm’s law to that resistance gives an internal drop I r_int. The model therefore gives V_terminal = EMF − I r_int.",
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Practice using the verified source values: A battery has an EMF of 1.5 V and a total external-plus-internal resistance of 6.25 Ω. Find the current in amperes and milliamperes. Can these values alone determine the internal voltage drop?",
        "answer": "The current is 0.24 A, or 240 mA. No: the internal resistance must be known separately to calculate its voltage drop.",
        "explanation": "I = 1.5/6.25 = 0.24 A = 240 mA. An internal-drop calculation requires I r_int. The combined resistance does not identify r_int separately, so the internal drop cannot be determined from these supplied values alone.",
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "In the stated battery model, EMF = 6 V, internal resistance = 2 Ω, and load resistance = 10 Ω. Calculate total resistance, current, internal voltage drop, and terminal voltage. Check terminal voltage using the load resistance.",
        "answer": "R_total = 12 Ω; I = 0.5 A; internal drop = 1 V; terminal voltage = 5 V. The load-voltage check also gives 5 V.",
        "explanation": "Add the series resistances: R_total = 10 + 2 = 12 Ω. Current is I = 6/12 = 0.5 A. The internal drop is 0.5 × 2 = 1 V. Subtract it from EMF to obtain 5 V at the terminals. The load calculation confirms this: 0.5 × 10 = 5 V.",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Keep EMF = 6 V and internal resistance = 2 Ω, but change the load from 10 Ω to 4 Ω. Calculate the new current and terminal voltage. Compare them with the preceding exercise.",
        "answer": "The new current is 1 A and terminal voltage is 4 V. Compared with the preceding exercise, current rises from 0.5 A to 1 A while terminal voltage falls from 5 V to 4 V.",
        "explanation": "The new total is 4 + 2 = 6 Ω, so I = 6/6 = 1 A. Internal drop becomes 1 × 2 = 2 V, leaving V_terminal = 6 − 2 = 4 V. The load check gives 1 × 4 = 4 V. The smaller load resistance increases current, which increases the drop across the unchanged internal resistance.",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-Q01",
        "type": "reflection",
        "prompt": "Explain why a battery’s terminal voltage can be lower than its EMF when it supplies a resistive load. Identify where the difference in voltage appears in the model.",
        "explain": "The internal resistance is in series with the external load. Applying Ohm’s law to that resistance gives an internal drop I r_int. The model therefore gives V_terminal = EMF − I r_int.",
        "rubric": "Expected answer: Load current causes a voltage drop across the battery’s internal resistance. That internal drop accounts for the difference between EMF and loaded terminal voltage.\nReasoning: The internal resistance is in series with the external load. Applying Ohm’s law to that resistance gives an internal drop I r_int. The model therefore gives V_terminal = EMF − I r_int.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-Q02",
        "type": "reflection",
        "prompt": "Practice using the verified source values: A battery has an EMF of 1.5 V and a total external-plus-internal resistance of 6.25 Ω. Find the current in amperes and milliamperes. Can these values alone determine the internal voltage drop?",
        "explain": "I = 1.5/6.25 = 0.24 A = 240 mA. An internal-drop calculation requires I r_int. The combined resistance does not identify r_int separately, so the internal drop cannot be determined from these supplied values alone.",
        "rubric": "Expected answer: The current is 0.24 A, or 240 mA. No: the internal resistance must be known separately to calculate its voltage drop.\nReasoning: I = 1.5/6.25 = 0.24 A = 240 mA. An internal-drop calculation requires I r_int. The combined resistance does not identify r_int separately, so the internal drop cannot be determined from these supplied values alone.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-Q03",
        "type": "reflection",
        "prompt": "In the stated battery model, EMF = 6 V, internal resistance = 2 Ω, and load resistance = 10 Ω. Calculate total resistance, current, internal voltage drop, and terminal voltage. Check terminal voltage using the load resistance.",
        "explain": "Add the series resistances: R_total = 10 + 2 = 12 Ω. Current is I = 6/12 = 0.5 A. The internal drop is 0.5 × 2 = 1 V. Subtract it from EMF to obtain 5 V at the terminals. The load calculation confirms this: 0.5 × 10 = 5 V.",
        "rubric": "Expected answer: R_total = 12 Ω; I = 0.5 A; internal drop = 1 V; terminal voltage = 5 V. The load-voltage check also gives 5 V.\nReasoning: Add the series resistances: R_total = 10 + 2 = 12 Ω. Current is I = 6/12 = 0.5 A. The internal drop is 0.5 × 2 = 1 V. Subtract it from EMF to obtain 5 V at the terminals. The load calculation confirms this: 0.5 × 10 = 5 V.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-Q04",
        "type": "reflection",
        "prompt": "Keep EMF = 6 V and internal resistance = 2 Ω, but change the load from 10 Ω to 4 Ω. Calculate the new current and terminal voltage. Compare them with the preceding exercise.",
        "explain": "The new total is 4 + 2 = 6 Ω, so I = 6/6 = 1 A. Internal drop becomes 1 × 2 = 2 V, leaving V_terminal = 6 − 2 = 4 V. The load check gives 1 × 4 = 4 V. The smaller load resistance increases current, which increases the drop across the unchanged internal resistance.",
        "rubric": "Expected answer: The new current is 1 A and terminal voltage is 4 V. Compared with the preceding exercise, current rises from 0.5 A to 1 A while terminal voltage falls from 5 V to 4 V.\nReasoning: The new total is 4 + 2 = 6 Ω, so I = 6/6 = 1 A. Internal drop becomes 1 × 2 = 2 V, leaving V_terminal = 6 − 2 = 4 V. The load check gives 1 × 4 = 4 V. The smaller load resistance increases current, which increases the drop across the unchanged internal resistance.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-Q05",
        "type": "reflection",
        "prompt": "For EMF = 6 V, internal resistance = 2 Ω, and load resistance = 4 Ω, a learner calculates I = 6/4 = 1.5 A. What model assumption has been omitted, and what is the correct current?",
        "explain": "The calculation assigns the full EMF to the external resistance and omits the internal series resistance. The denominator must be 4 + 2 = 6 Ω, giving I = 6/6 = 1 A. The 1.5 A answer would apply to a different model with zero internal resistance.",
        "rubric": "Expected answer: The learner omitted the internal resistance. Including it gives I = 6/(4 + 2) = 1 A.\nReasoning: The calculation assigns the full EMF to the external resistance and omits the internal series resistance. The denominator must be 4 + 2 = 6 Ω, giving I = 6/6 = 1 A. The 1.5 A answer would apply to a different model with zero internal resistance.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-P06",
        "type": "reflection",
        "prompt": "Explain the main idea from “Two voltages in the battery model” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Internal Resistance” material on printed p. 18, including Figure 4, models a battery as an EMF together with an internal resistance in series with the external load. EMF is the source voltage in this model, measured in volts; despite its name, electromotive force is a voltage, not a mechanical force. Internal resistance represents resistance within the source. The load is the external resistance supplied by the circuit connected to the battery.\n\nDefine the symbols locally: use EMF for source voltage, r_int for internal resistance in ohms (Ω), R_ext for external load resistance in ohms, and I for current in amperes (A). Terminal voltage, V_terminal, is the voltage available across the external load.\n\nThe important new distinction is that EMF and loaded terminal voltage need not be equal. The source explains that current produces a voltage drop across internal resistance, leaving less voltage at the terminals. This lesson develops that stated model; it does not claim that one fixed internal-resistance value completely describes every real battery.",
        "safety": false,
        "source_ids": [
          "S6"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-P07",
        "type": "reflection",
        "prompt": "Use the explanation under “Find current from the complete series resistance” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Because the internal resistance and external load are in series, include both when finding the resistance that limits current. The series rule on printed p. 19 gives R_total = R_ext + r_int. Ohm’s law on printed p. 17 then gives I = EMF/R_total, so the battery-model expression is I = EMF/(R_ext + r_int).\n\nUse resistance values in the same unit before adding them. With EMF in volts and resistance in ohms, the calculated current is in amperes. These calculations assume a resistive load and fixed EMF and resistance values for the example.\n\nDo not substitute EMF into I = EMF/R_ext while ignoring a specified internal resistance. That would give all of the source voltage to the load, contrary to the model. For a positive internal resistance, the denominator R_ext + r_int is larger than R_ext alone, so the calculated current is smaller. This comparison is a consequence of the verified series and Ohm’s law relations.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-P08",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Verified source example: 1.5 V and 6.25 Ω”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified example spanning printed pp. 18–19 uses an EMF of 1.5 V and a combined external-plus-internal resistance of 6.25 Ω. Substitute the complete resistance into the battery-model equation:\n\nI = EMF/(R_ext + r_int)\nI = 1.5 V/6.25 Ω\nI = 0.24 A = 240 mA.\n\nThe last conversion expresses the same current in milliamperes: 0.24 A multiplied by 1000 mA/A is 240 mA. A substitution check gives I × R_total = 0.24 × 6.25 = 1.5 V, recovering the stated EMF.\n\nThe accepted extraction supports the combined 6.25 Ω value, but does not supply separate internal and external resistance values for this worked example. Consequently, this evidence is enough to reproduce the current, but not to calculate a separate numerical internal drop or terminal voltage. Do not invent a split of the 6.25 Ω and attribute it to the book. The next section uses explicitly newly authored values to demonstrate that additional calculation.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-P09",
        "type": "reflection",
        "prompt": "How would you check that you understood “From internal drop to loaded terminal voltage” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Apply Ohm’s law to each resistance in the source’s series model. The internal voltage drop is V_drop = I r_int. The remaining terminal voltage is V_terminal = EMF − I r_int. It also equals the load voltage, I R_ext. These equations express the source’s explanation of internal drop using the verified Ohm’s law relationship.\n\nNewly authored worked example: let EMF = 3 V, r_int = 1 Ω, and R_ext = 5 Ω. First, R_total = 5 + 1 = 6 Ω. Then I = 3/6 = 0.5 A. The internal drop is 0.5 × 1 = 0.5 V, so V_terminal = 3 − 0.5 = 2.5 V. Check independently across the load: I R_ext = 0.5 × 5 = 2.5 V. Finally, 0.5 V + 2.5 V = 3 V, accounting for the source voltage.\n\nFor fixed EMF and internal resistance, a larger current produces a larger internal drop and therefore a lower terminal voltage. If current is zero, this model gives zero internal drop and terminal voltage equal to EMF. These are consequences of the model, not a practical battery-testing procedure.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06-P10",
        "type": "reflection",
        "prompt": "Explain the main idea from “Two voltages in the battery model” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Internal Resistance” material on printed p. 18, including Figure 4, models a battery as an EMF together with an internal resistance in series with the external load. EMF is the source voltage in this model, measured in volts; despite its name, electromotive force is a voltage, not a mechanical force. Internal resistance represents resistance within the source. The load is the external resistance supplied by the circuit connected to the battery.\n\nDefine the symbols locally: use EMF for source voltage, r_int for internal resistance in ohms (Ω), R_ext for external load resistance in ohms, and I for current in amperes (A). Terminal voltage, V_terminal, is the voltage available across the external load.\n\nThe important new distinction is that EMF and loaded terminal voltage need not be equal. The source explains that current produces a voltage drop across internal resistance, leaving less voltage at the terminals. This lesson develops that stated model; it does not claim that one fixed internal-resistance value completely describes every real battery.",
        "safety": false,
        "source_ids": [
          "S6"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "internal",
    "kind": "mixed",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U06",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07",
    "generated": true,
    "subtrack": "generated",
    "title": "Sinusoidal Waveforms and Amplitude Measures",
    "description": "Read a sinusoidal cycle and distinguish peak, peak-to-peak and RMS voltage using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 19, Figure 5 and “Amplitude Conversion.” Worked calculations and fresh practice use the source’s rounded sine-wave conversion factors.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Read the cycle before reading its amplitude",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "Peak and peak-to-peak measure different spans",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "RMS and the source’s sine-wave factors",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "Worked conversions: identify the given measure first",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "Reverse conversions and rounding checks",
        "source_ids": [
          "S7"
        ]
      }
    ],
    "objectives": [
      "Locate the positive and negative extrema within a sinusoidal cycle.",
      "Distinguish peak voltage from peak-to-peak voltage.",
      "Recognize RMS as a different amplitude measure rather than a point on the waveform.",
      "Select and apply the verified sine-wave amplitude conversion factors.",
      "Check conversion results for sensible magnitude and appropriate rounding."
    ],
    "html": "<p>Read a sinusoidal cycle and distinguish peak, peak-to-peak and RMS voltage using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 19, Figure 5 and “Amplitude Conversion.” Worked calculations and fresh practice use the source’s rounded sine-wave conversion factors.</p><h3>Read the cycle before reading its amplitude</h3><p>Figure 5 on printed p. 19 shows one sinusoidal cycle from 0° to 360°. A cycle is one complete repetition of the waveform. The angle marks position within that repetition; it is not itself a voltage value or a time in seconds. The positive extremum occurs at 90°, and the negative extremum occurs at 270°. “Extremum” means an extreme value: the highest positive value or the lowest negative value.</p><p></p><p>Read the horizontal position and the vertical value separately. At 90°, the waveform reaches its positive peak; at 270°, it reaches its negative peak. These two positions are half a cycle apart. The negative peak is below the zero reference, but its distance from zero is a positive magnitude.</p><p></p><p>This lesson concerns the sinusoidal waveform and amplitude conversions verified on this page. It does not convert cycle angle into elapsed time or introduce other waveform shapes.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>Peak and peak-to-peak measure different spans</h3><p>Peak voltage, written V_p here, is the magnitude from the zero reference to an extreme of the sine wave. Peak-to-peak voltage, V_pp, is the full difference between the positive and negative extremes. Both quantities are expressed in volts (V), but they describe different spans on the waveform.</p><p></p><p>For the sine wave represented by the source, the positive and negative peak magnitudes are equal. Consequently, V_pp = 2V_p. Newly authored illustration: if the extremes are +4 V and −4 V, the peak magnitude is 4 V, while the peak-to-peak span is 4 − (−4) = 8 V. Subtracting a negative value adds its magnitude.</p><p></p><p>Before calculating, name the requested span: zero-to-extreme or extreme-to-extreme. Saying only “the amplitude is 8 V” can leave the measure unclear. Writing “8 V peak-to-peak” identifies it. Do not confuse a negative instantaneous voltage, such as −4 V, with a negative peak magnitude.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>RMS and the source’s sine-wave factors</h3><p>RMS stands for root mean square. It is another way of specifying waveform amplitude, not the voltage at a particular angle and not the full positive-to-negative span. Write it as V_rms. The verified “Amplitude Conversion” material distinguishes RMS from peak and peak-to-peak voltage and supplies these rounded relations for a sine wave:</p><p></p><p>V_rms = 0.707V_p</p><p>V_p = 1.414V_rms</p><p>V_pp = 2.828V_rms</p><p>V_pp = 2V_p.</p><p></p><p>The multipliers are dimensionless: multiplying a voltage in volts by one of them still gives volts. For a nonzero sine wave, the magnitude ordering is V_rms &lt; V_p &lt; V_pp. This is a useful check, not a substitute for identifying the requested quantity.</p><p></p><p>These factors apply to sine waves. Do not use them as universal conversions for arbitrary waveforms. The extraction supplies conversion relations rather than a derivation of RMS, so this lesson practices their interpretation and use without claiming that the page establishes a general RMS calculation method.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>Worked conversions: identify the given measure first</h3><p>The verified extraction supplies conversion factors but no complete numerical amplitude example to reproduce. The following worked examples are newly authored applications of those factors.</p><p></p><p>Example 1: a sine wave has V_p = 10 V. Find RMS and peak-to-peak voltage. Since the given value is peak, use V_rms = 0.707V_p: V_rms = 0.707 × 10 = 7.07 V. For peak-to-peak, V_pp = 2 × 10 = 20 V. The ordering 7.07 &lt; 10 &lt; 20 agrees with the expected magnitudes.</p><p></p><p>Example 2: a sine wave is specified as 5 V RMS. Find peak and peak-to-peak voltage. Use V_p = 1.414 × 5 = 7.07 V, then V_pp = 2.828 × 5 = 14.14 V. The alternative peak-to-peak check gives 2 × 7.07 = 14.14 V.</p><p></p><p>Keep the measure attached to each answer: 7.07 V peak and 14.14 V peak-to-peak are not interchangeable labels. These are written calculations, not instructions to generate or measure a waveform.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>Reverse conversions and rounding checks</h3><p>When the supplied value is peak-to-peak, first recover peak voltage by dividing by two. This reverses V_pp = 2V_p. Newly authored example: for V_pp = 12 V, V_p = 12/2 = 6 V. Then V_rms = 0.707 × 6 = 4.242 V, or approximately 4.24 V.</p><p></p><p>You can also reverse the direct RMS relation: V_rms = V_pp/2.828. This gives 12/2.828 ≈ 4.243 V. The tiny difference between the two routes comes from using the source’s rounded factors. It is not evidence that peak-to-peak and RMS have changed meaning.</p><p></p><p>A reliable workflow is: label the given measure, label the requested measure, choose a relation connecting them, substitute with units, and check the magnitude ordering. Avoid presenting the rounded conversion factors as exact identities. Retain enough digits during the calculation, then round the final value to a sensible displayed precision.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Within the source’s 0°–360° sinusoidal cycle, where are the positive and negative extrema? Do those angles specify voltage values?",
        "answer": "The positive extremum is at 90° and the negative extremum is at 270°. The angles specify cycle position, not numerical voltage.",
        "explanation": "Figure 5 places the extrema at those cycle positions. An angle locates a point within the repetition; an amplitude specification is needed to assign its voltage value.",
        "source_ids": [
          "S7"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "A sine wave reaches +3 V and −3 V. Find its peak magnitude and peak-to-peak voltage, showing the subtraction.",
        "answer": "V_p = 3 V; V_pp = 3 − (−3) = 6 V.",
        "explanation": "Peak magnitude measures zero-to-extreme. Peak-to-peak measures the full span: 3 − (−3) = 6 V, also equal to 2V_p.",
        "source_ids": [
          "S7"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "A sine wave has a peak voltage of 8 V. Calculate its RMS and peak-to-peak voltages using the source’s factors.",
        "answer": "V_rms ≈ 5.66 V; V_pp = 16 V.",
        "explanation": "V_rms = 0.707 × 8 = 5.656 V, rounded to 5.66 V. V_pp = 2 × 8 = 16 V. The resulting RMS magnitude is smaller than peak, while peak-to-peak is larger.",
        "source_ids": [
          "S7"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A sine wave is specified as 2 V RMS. Find its peak and peak-to-peak voltages. Keep the amplitude labels in your answer.",
        "answer": "V_p ≈ 2.83 V peak; V_pp ≈ 5.66 V peak-to-peak.",
        "explanation": "Use the RMS-to-peak factor: 1.414 × 2 = 2.828 V. For peak-to-peak, 2.828 × 2 = 5.656 V. Doubling the calculated peak provides the same peak-to-peak result.",
        "source_ids": [
          "S7"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q01",
        "type": "reflection",
        "prompt": "Within the source’s 0°–360° sinusoidal cycle, where are the positive and negative extrema? Do those angles specify voltage values?",
        "explain": "Figure 5 places the extrema at those cycle positions. An angle locates a point within the repetition; an amplitude specification is needed to assign its voltage value.",
        "rubric": "Expected answer: The positive extremum is at 90° and the negative extremum is at 270°. The angles specify cycle position, not numerical voltage.\nReasoning: Figure 5 places the extrema at those cycle positions. An angle locates a point within the repetition; an amplitude specification is needed to assign its voltage value.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q02",
        "type": "reflection",
        "prompt": "A sine wave reaches +3 V and −3 V. Find its peak magnitude and peak-to-peak voltage, showing the subtraction.",
        "explain": "Peak magnitude measures zero-to-extreme. Peak-to-peak measures the full span: 3 − (−3) = 6 V, also equal to 2V_p.",
        "rubric": "Expected answer: V_p = 3 V; V_pp = 3 − (−3) = 6 V.\nReasoning: Peak magnitude measures zero-to-extreme. Peak-to-peak measures the full span: 3 − (−3) = 6 V, also equal to 2V_p.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q03",
        "type": "reflection",
        "prompt": "A sine wave has a peak voltage of 8 V. Calculate its RMS and peak-to-peak voltages using the source’s factors.",
        "explain": "V_rms = 0.707 × 8 = 5.656 V, rounded to 5.66 V. V_pp = 2 × 8 = 16 V. The resulting RMS magnitude is smaller than peak, while peak-to-peak is larger.",
        "rubric": "Expected answer: V_rms ≈ 5.66 V; V_pp = 16 V.\nReasoning: V_rms = 0.707 × 8 = 5.656 V, rounded to 5.66 V. V_pp = 2 × 8 = 16 V. The resulting RMS magnitude is smaller than peak, while peak-to-peak is larger.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q04",
        "type": "reflection",
        "prompt": "A sine wave is specified as 2 V RMS. Find its peak and peak-to-peak voltages. Keep the amplitude labels in your answer.",
        "explain": "Use the RMS-to-peak factor: 1.414 × 2 = 2.828 V. For peak-to-peak, 2.828 × 2 = 5.656 V. Doubling the calculated peak provides the same peak-to-peak result.",
        "rubric": "Expected answer: V_p ≈ 2.83 V peak; V_pp ≈ 5.66 V peak-to-peak.\nReasoning: Use the RMS-to-peak factor: 1.414 × 2 = 2.828 V. For peak-to-peak, 2.828 × 2 = 5.656 V. Doubling the calculated peak provides the same peak-to-peak result.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q05",
        "type": "reflection",
        "prompt": "A sine wave is 20 V peak-to-peak. Find peak voltage first, then RMS voltage.",
        "explain": "Reverse V_pp = 2V_p to obtain V_p = 20/2 = 10 V. Then V_rms = 0.707 × 10 = 7.07 V. Multiplying 20 directly by 0.707 would incorrectly treat the peak-to-peak value as peak.",
        "rubric": "Expected answer: V_p = 10 V; V_rms ≈ 7.07 V.\nReasoning: Reverse V_pp = 2V_p to obtain V_p = 20/2 = 10 V. Then V_rms = 0.707 × 10 = 7.07 V. Multiplying 20 directly by 0.707 would incorrectly treat the peak-to-peak value as peak.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q06",
        "type": "reflection",
        "prompt": "A learner says, “A 6 V peak sine wave is also 6 V RMS because both are in volts.” Correct the claim and calculate the RMS value.",
        "explain": "Sharing a unit does not make the amplitude measures identical. The source’s sine-wave relation gives V_rms = 0.707 × 6 = 4.242 V, approximately 4.24 V.",
        "rubric": "Expected answer: The claim is incorrect. Peak and RMS are different measures; 6 V peak corresponds to approximately 4.24 V RMS.\nReasoning: Sharing a unit does not make the amplitude measures identical. The source’s sine-wave relation gives V_rms = 0.707 × 6 = 4.242 V, approximately 4.24 V.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-Q07",
        "type": "reflection",
        "prompt": "A waveform is specified as 4 V peak, but its shape is not given. Can you conclude from this lesson that its RMS voltage is 2.828 V? Explain.",
        "explain": "The numerical product 0.707 × 4 is 2.828, but the cited conversion factor is specifically for a sine wave. Correct arithmetic cannot establish that an unsupported waveform assumption is valid.",
        "rubric": "Expected answer: No. That RMS result follows only if the waveform is sinusoidal; the shape has not been established.\nReasoning: The numerical product 0.707 × 4 is 2.828, but the cited conversion factor is specifically for a sine wave. Correct arithmetic cannot establish that an unsupported waveform assumption is valid.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “Read the cycle before reading its amplitude” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Figure 5 on printed p. 19 shows one sinusoidal cycle from 0° to 360°. A cycle is one complete repetition of the waveform. The angle marks position within that repetition; it is not itself a voltage value or a time in seconds. The positive extremum occurs at 90°, and the negative extremum occurs at 270°. “Extremum” means an extreme value: the highest positive value or the lowest negative value.\n\nRead the horizontal position and the vertical value separately. At 90°, the waveform reaches its positive peak; at 270°, it reaches its negative peak. These two positions are half a cycle apart. The negative peak is below the zero reference, but its distance from zero is a positive magnitude.\n\nThis lesson concerns the sinusoidal waveform and amplitude conversions verified on this page. It does not convert cycle angle into elapsed time or introduce other waveform shapes.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Peak and peak-to-peak measure different spans” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Peak voltage, written V_p here, is the magnitude from the zero reference to an extreme of the sine wave. Peak-to-peak voltage, V_pp, is the full difference between the positive and negative extremes. Both quantities are expressed in volts (V), but they describe different spans on the waveform.\n\nFor the sine wave represented by the source, the positive and negative peak magnitudes are equal. Consequently, V_pp = 2V_p. Newly authored illustration: if the extremes are +4 V and −4 V, the peak magnitude is 4 V, while the peak-to-peak span is 4 − (−4) = 8 V. Subtracting a negative value adds its magnitude.\n\nBefore calculating, name the requested span: zero-to-extreme or extreme-to-extreme. Saying only “the amplitude is 8 V” can leave the measure unclear. Writing “8 V peak-to-peak” identifies it. Do not confuse a negative instantaneous voltage, such as −4 V, with a negative peak magnitude.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “RMS and the source’s sine-wave factors”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "RMS stands for root mean square. It is another way of specifying waveform amplitude, not the voltage at a particular angle and not the full positive-to-negative span. Write it as V_rms. The verified “Amplitude Conversion” material distinguishes RMS from peak and peak-to-peak voltage and supplies these rounded relations for a sine wave:\n\nV_rms = 0.707V_p\nV_p = 1.414V_rms\nV_pp = 2.828V_rms\nV_pp = 2V_p.\n\nThe multipliers are dimensionless: multiplying a voltage in volts by one of them still gives volts. For a nonzero sine wave, the magnitude ordering is V_rms < V_p < V_pp. This is a useful check, not a substitute for identifying the requested quantity.\n\nThese factors apply to sine waves. Do not use them as universal conversions for arbitrary waveforms. The extraction supplies conversion relations rather than a derivation of RMS, so this lesson practices their interpretation and use without claiming that the page establishes a general RMS calculation method.",
        "safety": false,
        "source_ids": [
          "S7"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "sine",
    "kind": "mixed",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U07",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08",
    "generated": true,
    "subtrack": "generated",
    "title": "Period and Frequency Calculations",
    "description": "Convert between period and frequency using the verified reciprocal relations in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 19, with frequency-prefix support from printed pp. 16–17. Newly authored worked examples emphasize units, reciprocal entry and magnitude checks.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17, 19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "One repetition, two ways to describe it",
        "source_ids": [
          "S8"
        ]
      },
      {
        "heading": "Worked method: frequency to period",
        "source_ids": [
          "S8"
        ]
      },
      {
        "heading": "Worked method: period to frequency",
        "source_ids": [
          "S8"
        ]
      },
      {
        "heading": "Convert frequency units before taking the reciprocal",
        "source_ids": [
          "S2",
          "S8"
        ]
      },
      {
        "heading": "Rounding and two useful checks",
        "source_ids": [
          "S8"
        ]
      }
    ],
    "objectives": [
      "Identify period as a time in seconds and frequency as a quantity in hertz.",
      "Use T = 1/f and f = 1/T to calculate the requested quantity.",
      "Convert frequency prefixes before applying the reciprocal relation.",
      "Check that a higher frequency corresponds to a shorter period.",
      "Distinguish rounded displayed results from exact equalities."
    ],
    "html": "<p>Convert between period and frequency using the verified reciprocal relations in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 19, with frequency-prefix support from printed pp. 16–17. Newly authored worked examples emphasize units, reciprocal entry and magnitude checks.</p><h3>One repetition, two ways to describe it</h3><p>The “Time and Frequency Conversion” material on printed p. 19 relates period and frequency as reciprocals. Period, written T, is the time for one cycle and is measured in seconds (s). Frequency, written f here, describes how many cycles occur per second and is measured in hertz (Hz). The source also uses capital F for frequency; this lesson consistently uses lowercase f.</p><p></p><p>The two relations are T = 1/f and f = 1/T. A reciprocal means one divided by a quantity—not that quantity divided by one. Thus, finding period from frequency means dividing 1 by the frequency. Finding frequency from period means dividing 1 by the period.</p><p></p><p>These quantities describe the same repetition from two viewpoints: the duration of one cycle and the number of cycles per second. This lesson is independent calculation practice; no prior lesson completion is assumed.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.)</p><h3>Worked method: frequency to period</h3><p>Use frequency in hertz when you want T = 1/f to return period in seconds. Conversely, use period in seconds when you want f = 1/T to return frequency in hertz. Hertz corresponds to reciprocal seconds, so taking the reciprocal exchanges these units.</p><p></p><p>Newly authored worked example: find the period of a 50 Hz repetition. Write T = 1/f, then substitute T = 1/(50 Hz) = 0.02 s. This says that each cycle lasts two hundredths of a second. Check by multiplying the numerical values in the specified units: 50 × 0.02 = 1.</p><p></p><p>On a calculator, enter 1 ÷ 50. If using a reciprocal key, confirm that it performs 1 divided by the entered value. Entering 50 ÷ 1 leaves the frequency’s numerical value unchanged and does not calculate period. Keep the output unit beside the result: 0.02 s is a period, not a frequency.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.)</p><h3>Worked method: period to frequency</h3><p>Newly authored worked example: a repetition has a period of 0.004 s. Find its frequency. Because the given quantity is period, choose f = 1/T. Substitute f = 1/(0.004 s) = 250 Hz.</p><p></p><p>The decimal 0.004 means four thousandths. Dividing 1 by a positive number smaller than 1 produces a number greater than 1; a result of 0.004 Hz would therefore indicate that the reciprocal was not taken. Check the calculation: 250 × 0.004 = 1.</p><p></p><p>The same relation gives a useful direction check. If period doubles while remaining positive, frequency halves: changing this example’s period from 0.004 s to 0.008 s gives 125 Hz. Equivalently, increasing frequency shortens period. These comparisons follow from the reciprocal formula; they are not additional source examples.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.)</p><h3>Convert frequency units before taking the reciprocal</h3><p>The verified conversion examples on printed pp. 16–17 include 700 kHz = 700000 Hz = 0.7 MHz. They show that kilohertz values are multiplied by 1000 to obtain hertz and divided by 1000 to obtain megahertz. Preserve lowercase k and uppercase M in these prefixes.</p><p></p><p>Newly authored application: find the period at 2 kHz. First convert the frequency: 2 kHz = 2000 Hz. Then T = 1/2000 s = 0.0005 s. Taking 1/2 and labeling the result seconds would incorrectly treat 2 kHz as 2 Hz.</p><p></p><p>A prefix changes the numerical expression, not the frequency itself. As another application of the source’s verified conversion, 700 kHz and 0.7 MHz must give the same period because both are 700000 Hz. Their period is 1/700000 s ≈ 0.00000143 s. Converting to hertz before taking the reciprocal makes the output unit explicit and avoids prefix-related ambiguity.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.)</p><h3>Rounding and two useful checks</h3><p>For 60 Hz, the reciprocal relation gives T = 1/60 s = 0.016666… s. Expressed in milliseconds, this is 16.666… ms, because one second contains 1000 milliseconds. The verified extraction flags the source’s displayed 16.6 ms as a limited-precision representation, not an exact equality. Written clearly, the result is approximately 16.6 ms at the source’s displayed precision; rounding to the nearest tenth of a millisecond instead gives 16.7 ms.</p><p></p><p>Keep the distinction between an exact relation and a rounded numerical result. T = 1/f is the relation; a shortened decimal generally needs an approximation sign. Retain enough digits during calculation and round the final answer rather than repeatedly rounding intermediate values.</p><p></p><p>For a final check, multiply frequency in hertz by period in seconds. The result should be 1, or close to 1 if the period has been rounded. Also ask whether the direction makes sense: higher frequency must mean less time per cycle.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "A repetition has a frequency of 25 Hz. Find its period in seconds and verify the result by multiplication.",
        "answer": "T = 0.04 s; 25 × 0.04 = 1.",
        "explanation": "Use T = 1/f = 1/25 = 0.04 s. The check is 25 × 0.04 = 1. The calculation finds time per cycle, so the answer is in seconds.",
        "source_ids": [
          "S8"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "A period is 0.002 s. Find the frequency in hertz and then express it in kilohertz.",
        "answer": "f = 500 Hz = 0.5 kHz.",
        "explanation": "First take the reciprocal: f = 1/0.002 = 500 Hz. Since 1000 Hz equals 1 kHz, divide the hertz value by 1000: 500 Hz = 0.5 kHz. Check with 500 × 0.002 = 1.",
        "source_ids": [
          "S8",
          "S2"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Find the period of a 4 kHz repetition. Show the conversion to hertz before calculating.",
        "answer": "4 kHz = 4000 Hz; T = 0.00025 s.",
        "explanation": "Convert 4 kHz to 4000 Hz. Then T = 1/4000 = 0.00025 s. Substituting 4 without converting would calculate the period of 4 Hz, a different frequency.",
        "source_ids": [
          "S2",
          "S8"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Frequencies of 100 Hz and 200 Hz are compared. Find both periods and describe what happens when frequency doubles.",
        "answer": "The periods are 0.01 s and 0.005 s respectively. Doubling frequency halves period.",
        "explanation": "For 100 Hz, T = 1/100 = 0.01 s. For 200 Hz, T = 1/200 = 0.005 s. The larger denominator produces the smaller reciprocal: doubling frequency halves period.",
        "source_ids": [
          "S8"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q01",
        "type": "reflection",
        "prompt": "A repetition has a frequency of 25 Hz. Find its period in seconds and verify the result by multiplication.",
        "explain": "Use T = 1/f = 1/25 = 0.04 s. The check is 25 × 0.04 = 1. The calculation finds time per cycle, so the answer is in seconds.",
        "rubric": "Expected answer: T = 0.04 s; 25 × 0.04 = 1.\nReasoning: Use T = 1/f = 1/25 = 0.04 s. The check is 25 × 0.04 = 1. The calculation finds time per cycle, so the answer is in seconds.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q02",
        "type": "reflection",
        "prompt": "A period is 0.002 s. Find the frequency in hertz and then express it in kilohertz.",
        "explain": "First take the reciprocal: f = 1/0.002 = 500 Hz. Since 1000 Hz equals 1 kHz, divide the hertz value by 1000: 500 Hz = 0.5 kHz. Check with 500 × 0.002 = 1.",
        "rubric": "Expected answer: f = 500 Hz = 0.5 kHz.\nReasoning: First take the reciprocal: f = 1/0.002 = 500 Hz. Since 1000 Hz equals 1 kHz, divide the hertz value by 1000: 500 Hz = 0.5 kHz. Check with 500 × 0.002 = 1.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q03",
        "type": "reflection",
        "prompt": "Find the period of a 4 kHz repetition. Show the conversion to hertz before calculating.",
        "explain": "Convert 4 kHz to 4000 Hz. Then T = 1/4000 = 0.00025 s. Substituting 4 without converting would calculate the period of 4 Hz, a different frequency.",
        "rubric": "Expected answer: 4 kHz = 4000 Hz; T = 0.00025 s.\nReasoning: Convert 4 kHz to 4000 Hz. Then T = 1/4000 = 0.00025 s. Substituting 4 without converting would calculate the period of 4 Hz, a different frequency.",
        "safety": false,
        "source_ids": [
          "S2",
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q04",
        "type": "reflection",
        "prompt": "Frequencies of 100 Hz and 200 Hz are compared. Find both periods and describe what happens when frequency doubles.",
        "explain": "For 100 Hz, T = 1/100 = 0.01 s. For 200 Hz, T = 1/200 = 0.005 s. The larger denominator produces the smaller reciprocal: doubling frequency halves period.",
        "rubric": "Expected answer: The periods are 0.01 s and 0.005 s respectively. Doubling frequency halves period.\nReasoning: For 100 Hz, T = 1/100 = 0.01 s. For 200 Hz, T = 1/200 = 0.005 s. The larger denominator produces the smaller reciprocal: doubling frequency halves period.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q05",
        "type": "reflection",
        "prompt": "A learner writes, “For 5 kHz, T = 1/5 = 0.2 s.” Identify the unit error and give the correct period.",
        "explain": "The learner treated the numerical value in kilohertz as if it were in hertz. Convert first: 5 kHz = 5000 Hz. Then T = 1/5000 = 0.0002 s. The claimed 0.2 s would correspond to 5 Hz.",
        "rubric": "Expected answer: The frequency was not converted to hertz. The correct period is 0.0002 s.\nReasoning: The learner treated the numerical value in kilohertz as if it were in hertz. Convert first: 5 kHz = 5000 Hz. Then T = 1/5000 = 0.0002 s. The claimed 0.2 s would correspond to 5 Hz.",
        "safety": false,
        "source_ids": [
          "S2",
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q06",
        "type": "reflection",
        "prompt": "Are 700 kHz and 0.7 MHz associated with different periods? Use the source’s verified conversion to explain and calculate the period approximately.",
        "explain": "The verified conversion identifies both expressions as 700000 Hz. Therefore each gives T = 1/700000 s ≈ 0.00000143 s. A change of unit expression does not change the physical frequency or its period.",
        "rubric": "Expected answer: No. Both describe the same frequency and have T ≈ 0.00000143 s.\nReasoning: The verified conversion identifies both expressions as 700000 Hz. Therefore each gives T = 1/700000 s ≈ 0.00000143 s. A change of unit expression does not change the physical frequency or its period.",
        "safety": false,
        "source_ids": [
          "S2",
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-Q07",
        "type": "reflection",
        "prompt": "Calculate the period at 60 Hz in seconds. Explain why the source’s displayed 16.6 ms should not be treated as an exact equality.",
        "explain": "The reciprocal gives 1/60 s = 0.016666… s, or 16.666… ms. The finite display 16.6 ms omits further digits. It should be marked approximate; ordinary rounding to the nearest tenth of a millisecond gives 16.7 ms.",
        "rubric": "Expected answer: T = 1/60 s ≈ 0.016667 s. The displayed 16.6 ms is approximate, not exact.\nReasoning: The reciprocal gives 1/60 s = 0.016666… s, or 16.666… ms. The finite display 16.6 ms omits further digits. It should be marked approximate; ordinary rounding to the nearest tenth of a millisecond gives 16.7 ms.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “One repetition, two ways to describe it” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Time and Frequency Conversion” material on printed p. 19 relates period and frequency as reciprocals. Period, written T, is the time for one cycle and is measured in seconds (s). Frequency, written f here, describes how many cycles occur per second and is measured in hertz (Hz). The source also uses capital F for frequency; this lesson consistently uses lowercase f.\n\nThe two relations are T = 1/f and f = 1/T. A reciprocal means one divided by a quantity—not that quantity divided by one. Thus, finding period from frequency means dividing 1 by the frequency. Finding frequency from period means dividing 1 by the period.\n\nThese quantities describe the same repetition from two viewpoints: the duration of one cycle and the number of cycles per second. This lesson is independent calculation practice; no prior lesson completion is assumed.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Worked method: frequency to period” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Use frequency in hertz when you want T = 1/f to return period in seconds. Conversely, use period in seconds when you want f = 1/T to return frequency in hertz. Hertz corresponds to reciprocal seconds, so taking the reciprocal exchanges these units.\n\nNewly authored worked example: find the period of a 50 Hz repetition. Write T = 1/f, then substitute T = 1/(50 Hz) = 0.02 s. This says that each cycle lasts two hundredths of a second. Check by multiplying the numerical values in the specified units: 50 × 0.02 = 1.\n\nOn a calculator, enter 1 ÷ 50. If using a reciprocal key, confirm that it performs 1 divided by the entered value. Entering 50 ÷ 1 leaves the frequency’s numerical value unchanged and does not calculate period. Keep the output unit beside the result: 0.02 s is a period, not a frequency.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Worked method: period to frequency”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Newly authored worked example: a repetition has a period of 0.004 s. Find its frequency. Because the given quantity is period, choose f = 1/T. Substitute f = 1/(0.004 s) = 250 Hz.\n\nThe decimal 0.004 means four thousandths. Dividing 1 by a positive number smaller than 1 produces a number greater than 1; a result of 0.004 Hz would therefore indicate that the reciprocal was not taken. Check the calculation: 250 × 0.004 = 1.\n\nThe same relation gives a useful direction check. If period doubles while remaining positive, frequency halves: changing this example’s period from 0.004 s to 0.008 s gives 125 Hz. Equivalently, increasing frequency shortens period. These comparisons follow from the reciprocal formula; they are not additional source examples.",
        "safety": false,
        "source_ids": [
          "S8"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "period",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U08",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09",
    "generated": true,
    "subtrack": "generated",
    "title": "Capacitor Charge and Stored Energy",
    "description": "Relate capacitor voltage and capacitance to stored charge and electric-field energy using the verified formulas on printed p. 20 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Reproduce the source’s charge example, then practice energy calculations with clearly labeled newly authored examples.",
    "module": "Associate CET Study Guide",
    "sourcePages": "20",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Charge and energy are different stored quantities",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Verified source example: calculate charge",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Worked energy calculation: square voltage first",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Linear charge dependence and squared energy dependence",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Check the formula, conversion and requested quantity",
        "source_ids": [
          "S10"
        ]
      }
    ],
    "objectives": [
      "Identify capacitance, charge, voltage and stored energy by their symbols and units.",
      "Calculate stored charge using Q = CV with capacitance expressed in farads.",
      "Calculate stored electric-field energy using E = 0.5CV².",
      "Explain why doubling voltage doubles charge but quadruples energy at fixed capacitance.",
      "Check conversions, squared quantities and the distinction between charge and energy."
    ],
    "html": "<p>Relate capacitor voltage and capacitance to stored charge and electric-field energy using the verified formulas on printed p. 20 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Reproduce the source’s charge example, then practice energy calculations with clearly labeled newly authored examples.</p><h3>Charge and energy are different stored quantities</h3><p>The “Capacitance” material in the left column of printed p. 20 relates a capacitor’s capacitance and voltage to its stored charge and electric-field energy. These are two different quantities: charge is measured in coulombs, while energy is measured in joules. A charge result cannot be relabeled as an energy result.</p><p></p><p>Define each symbol locally: Q is charge in coulombs (C); C in a formula is capacitance in farads (F); V is voltage in volts (V); and E in this lesson is stored energy in joules (J). In particular, the C in Q = CV means capacitance, not the coulomb unit. These notation distinctions are a brief reminder; the new focus is calculating and comparing charge and energy.</p><p></p><p>The accepted source formulas are Q = CV and E = 0.5CV². The extraction flags conflicting notation in the right-column energy solution. That solution is not used here. Energy calculations below are newly authored applications of the clear left-column definition, not reconstructed book examples.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Verified source example: calculate charge</h3><p>The charge relation is Q = CV. Multiply capacitance in farads by voltage in volts to obtain charge in coulombs. For a fixed capacitance, this is a linear relationship: multiplying voltage by a factor multiplies charge by the same factor.</p><p></p><p>The verified charge example on printed p. 20 uses C = 5 µF and V = 12 V. Express the capacitance in farads before substituting: 5 µF = 5 × 10^-6 F = 0.000005 F. Then:</p><p></p><p>Q = CV</p><p>Q = (5 × 10^-6 F)(12 V)</p><p>Q = 60 × 10^-6 C = 60 µC.</p><p></p><p>The µ prefix in these expressions means one millionth. Thus 60 µC and 0.000060 C express the same charge. The intermediate multiplication is 5 × 12 = 60; the factor 10^-6 remains attached to the result.</p><p></p><p>Check by dividing the calculated charge by the voltage: (60 × 10^-6 C)/(12 V) = 5 × 10^-6 F, recovering the given capacitance. This reverse calculation follows from the same charge relation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Worked energy calculation: square voltage first</h3><p>The clear energy definition on printed p. 20 is E = 0.5CV². Here 0.5 means one-half, and V² means voltage multiplied by itself. Only voltage is squared: the expression is not 0.5(CV)². Use C in farads and V in volts to obtain E in joules.</p><p></p><p>Newly authored worked calculation using the same numerical inputs as the verified charge example: let C = 5 µF and V = 12 V. This is an instructional application of the accepted energy definition, not a transcription of the disputed right-column solution.</p><p></p><p>First convert capacitance: C = 5 × 10^-6 F. Next square the voltage’s numerical value: 12² = 12 × 12 = 144. Substitute:</p><p></p><p>E = 0.5 × (5 × 10^-6) × 144 J</p><p>E = 360 × 10^-6 J = 360 µJ = 0.000360 J.</p><p></p><p>For these inputs, Q = 60 µC and E = 360 µJ. Keep both labels: the numbers describe different quantities in different units. All examples in this lesson are paper calculations, not construction or testing instructions.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Linear charge dependence and squared energy dependence</h3><p>Compare the formulas while holding capacitance fixed. Charge contains V to the first power, so doubling voltage doubles Q. Energy contains V², so doubling voltage multiplies E by 2² = 4. Halving voltage halves charge but reduces energy to one-quarter. These comparisons are consequences of the source’s two accepted formulas.</p><p></p><p>Newly authored comparison: a 2 µF capacitor at 3 V has Q = (2 × 10^-6)(3) C = 6 µC and E = 0.5 × (2 × 10^-6) × 3² J = 9 µJ. At 6 V, the same capacitance gives Q = 12 µC and E = 36 µJ. The voltage doubles, charge doubles, and energy quadruples.</p><p></p><p>Now hold voltage fixed instead. Both formulas contain capacitance to the first power, so doubling capacitance doubles both charge and energy. State what is held fixed whenever making a comparison; otherwise, a change in capacitance could alter a conclusion based only on voltage.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Check the formula, conversion and requested quantity</h3><p>For each calculation, write the given capacitance and voltage, choose either the charge or energy relation, convert capacitance to farads, and retain the requested unit in the answer. For energy, show V² explicitly before multiplying. For charge, do not introduce a square that the formula does not contain.</p><p></p><p>Newly authored error check: for C = 4 µF and V = 5 V, Q = (4 × 10^-6)(5) C = 20 µC. Energy instead is E = 0.5 × (4 × 10^-6) × 25 J = 50 µJ. A proposed energy result of 10 µJ would come from using 5 rather than 5² and would omit the required square.</p><p></p><p>Use scaling as a second check: at fixed capacitance, a voltage increase by a factor of three must increase charge by three and energy by nine. Such checks can expose arithmetic or formula-selection errors, but they do not verify the original input values or resolve the source’s conflicting energy notation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "In Q = CV and E = 0.5CV², identify each quantity and its unit. Which quantity is squared?",
        "answer": "Q is charge in coulombs; C is capacitance in farads; V is voltage in volts; E is stored energy in joules. Voltage V is squared in the energy formula.",
        "explanation": "The accepted p. 20 definitions distinguish charge from energy. C inside these equations is the capacitance symbol; it does not mean the coulomb unit. The exponent in the energy formula applies only to voltage.",
        "source_ids": [
          "S10"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Practice using the verified source values: Calculate the charge for 5 µF at 12 V. Show the capacitance in farads and the answer in both coulombs and microcoulombs.",
        "answer": "C = 5 × 10^-6 F; Q = 0.000060 C = 60 µC.",
        "explanation": "Convert 5 µF to 5 × 10^-6 F, then use Q = CV: (5 × 10^-6)(12) = 60 × 10^-6 C. This reproduces the verified charge example.",
        "source_ids": [
          "S10"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "A capacitor has C = 10 µF and V = 4 V. Calculate its charge and stored energy, showing the voltage square.",
        "answer": "Q = 40 µC; E = 80 µJ.",
        "explanation": "C = 10 × 10^-6 F. Charge is Q = (10 × 10^-6)(4) = 40 × 10^-6 C. Energy is E = 0.5 × (10 × 10^-6) × 4² = 0.5 × (10 × 10^-6) × 16 = 80 × 10^-6 J.",
        "source_ids": [
          "S10"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Keep capacitance at 10 µF but increase voltage from 4 V to 8 V. Find the new charge and energy, and compare them with the preceding exercise.",
        "answer": "Q = 80 µC and E = 320 µJ. Charge doubles; energy quadruples.",
        "explanation": "Q = (10 × 10^-6)(8) C = 80 µC. E = 0.5 × (10 × 10^-6) × 64 J = 320 µJ. At fixed capacitance, the doubled voltage doubles charge and quadruples energy.",
        "source_ids": [
          "S10"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q01",
        "type": "reflection",
        "prompt": "In Q = CV and E = 0.5CV², identify each quantity and its unit. Which quantity is squared?",
        "explain": "The accepted p. 20 definitions distinguish charge from energy. C inside these equations is the capacitance symbol; it does not mean the coulomb unit. The exponent in the energy formula applies only to voltage.",
        "rubric": "Expected answer: Q is charge in coulombs; C is capacitance in farads; V is voltage in volts; E is stored energy in joules. Voltage V is squared in the energy formula.\nReasoning: The accepted p. 20 definitions distinguish charge from energy. C inside these equations is the capacitance symbol; it does not mean the coulomb unit. The exponent in the energy formula applies only to voltage.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q02",
        "type": "reflection",
        "prompt": "Practice using the verified source values: Calculate the charge for 5 µF at 12 V. Show the capacitance in farads and the answer in both coulombs and microcoulombs.",
        "explain": "Convert 5 µF to 5 × 10^-6 F, then use Q = CV: (5 × 10^-6)(12) = 60 × 10^-6 C. This reproduces the verified charge example.",
        "rubric": "Expected answer: C = 5 × 10^-6 F; Q = 0.000060 C = 60 µC.\nReasoning: Convert 5 µF to 5 × 10^-6 F, then use Q = CV: (5 × 10^-6)(12) = 60 × 10^-6 C. This reproduces the verified charge example.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q03",
        "type": "reflection",
        "prompt": "A capacitor has C = 10 µF and V = 4 V. Calculate its charge and stored energy, showing the voltage square.",
        "explain": "C = 10 × 10^-6 F. Charge is Q = (10 × 10^-6)(4) = 40 × 10^-6 C. Energy is E = 0.5 × (10 × 10^-6) × 4² = 0.5 × (10 × 10^-6) × 16 = 80 × 10^-6 J.",
        "rubric": "Expected answer: Q = 40 µC; E = 80 µJ.\nReasoning: C = 10 × 10^-6 F. Charge is Q = (10 × 10^-6)(4) = 40 × 10^-6 C. Energy is E = 0.5 × (10 × 10^-6) × 4² = 0.5 × (10 × 10^-6) × 16 = 80 × 10^-6 J.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q04",
        "type": "reflection",
        "prompt": "Keep capacitance at 10 µF but increase voltage from 4 V to 8 V. Find the new charge and energy, and compare them with the preceding exercise.",
        "explain": "Q = (10 × 10^-6)(8) C = 80 µC. E = 0.5 × (10 × 10^-6) × 64 J = 320 µJ. At fixed capacitance, the doubled voltage doubles charge and quadruples energy.",
        "rubric": "Expected answer: Q = 80 µC and E = 320 µJ. Charge doubles; energy quadruples.\nReasoning: Q = (10 × 10^-6)(8) C = 80 µC. E = 0.5 × (10 × 10^-6) × 64 J = 320 µJ. At fixed capacitance, the doubled voltage doubles charge and quadruples energy.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q05",
        "type": "reflection",
        "prompt": "A capacitor's voltage is halved while its capacitance remains fixed. What fraction of its original charge and energy remains?",
        "explain": "Replacing V with V/2 in Q = CV multiplies Q by 1/2. In E = 0.5CV², replacing V with V/2 multiplies E by (1/2)² = 1/4.",
        "rubric": "Expected answer: Charge becomes one-half of its original value; energy becomes one-quarter.\nReasoning: Replacing V with V/2 in Q = CV multiplies Q by 1/2. In E = 0.5CV², replacing V with V/2 multiplies E by (1/2)² = 1/4.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q06",
        "type": "reflection",
        "prompt": "For 8 µF at 3 V, a learner calculates E = 0.5 × (8 × 10^-6) × 3 = 12 µJ. Identify the error and calculate the correct energy.",
        "explain": "The energy formula requires voltage squared. Use 3² = 9: E = 0.5 × (8 × 10^-6) × 9 J = 36 × 10^-6 J. The learner used the voltage only once.",
        "rubric": "Expected answer: The voltage square was omitted. The correct energy is 36 µJ.\nReasoning: The energy formula requires voltage squared. Use 3² = 9: E = 0.5 × (8 × 10^-6) × 9 J = 36 × 10^-6 J. The learner used the voltage only once.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-Q07",
        "type": "reflection",
        "prompt": "At the same voltage, one capacitor has three times the capacitance of another. How do their charge and energy compare? State the assumption that makes the comparison valid.",
        "explain": "Both Q = CV and E = 0.5CV² contain capacitance to the first power. With the same voltage for both capacitors, multiplying capacitance by three multiplies both results by three.",
        "rubric": "Expected answer: The larger-capacitance capacitor has three times the charge and three times the energy, assuming the voltage is unchanged.\nReasoning: Both Q = CV and E = 0.5CV² contain capacitance to the first power. With the same voltage for both capacitors, multiplying capacitance by three multiplies both results by three.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “Charge and energy are different stored quantities” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Capacitance” material in the left column of printed p. 20 relates a capacitor’s capacitance and voltage to its stored charge and electric-field energy. These are two different quantities: charge is measured in coulombs, while energy is measured in joules. A charge result cannot be relabeled as an energy result.\n\nDefine each symbol locally: Q is charge in coulombs (C); C in a formula is capacitance in farads (F); V is voltage in volts (V); and E in this lesson is stored energy in joules (J). In particular, the C in Q = CV means capacitance, not the coulomb unit. These notation distinctions are a brief reminder; the new focus is calculating and comparing charge and energy.\n\nThe accepted source formulas are Q = CV and E = 0.5CV². The extraction flags conflicting notation in the right-column energy solution. That solution is not used here. Energy calculations below are newly authored applications of the clear left-column definition, not reconstructed book examples.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Verified source example: calculate charge” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The charge relation is Q = CV. Multiply capacitance in farads by voltage in volts to obtain charge in coulombs. For a fixed capacitance, this is a linear relationship: multiplying voltage by a factor multiplies charge by the same factor.\n\nThe verified charge example on printed p. 20 uses C = 5 µF and V = 12 V. Express the capacitance in farads before substituting: 5 µF = 5 × 10^-6 F = 0.000005 F. Then:\n\nQ = CV\nQ = (5 × 10^-6 F)(12 V)\nQ = 60 × 10^-6 C = 60 µC.\n\nThe µ prefix in these expressions means one millionth. Thus 60 µC and 0.000060 C express the same charge. The intermediate multiplication is 5 × 12 = 60; the factor 10^-6 remains attached to the result.\n\nCheck by dividing the calculated charge by the voltage: (60 × 10^-6 C)/(12 V) = 5 × 10^-6 F, recovering the given capacitance. This reverse calculation follows from the same charge relation.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Worked energy calculation: square voltage first”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The clear energy definition on printed p. 20 is E = 0.5CV². Here 0.5 means one-half, and V² means voltage multiplied by itself. Only voltage is squared: the expression is not 0.5(CV)². Use C in farads and V in volts to obtain E in joules.\n\nNewly authored worked calculation using the same numerical inputs as the verified charge example: let C = 5 µF and V = 12 V. This is an instructional application of the accepted energy definition, not a transcription of the disputed right-column solution.\n\nFirst convert capacitance: C = 5 × 10^-6 F. Next square the voltage’s numerical value: 12² = 12 × 12 = 144. Substitute:\n\nE = 0.5 × (5 × 10^-6) × 144 J\nE = 360 × 10^-6 J = 360 µJ = 0.000360 J.\n\nFor these inputs, Q = 60 µC and E = 360 µJ. Keep both labels: the numbers describe different quantities in different units. All examples in this lesson are paper calculations, not construction or testing instructions.",
        "safety": false,
        "source_ids": [
          "S10"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "energy",
    "kind": "mixed",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U09",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10",
    "generated": true,
    "subtrack": "generated",
    "title": "Capacitor Network Totals",
    "description": "Calculate equivalent capacitance using the verified series and parallel rules in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 20–21. Source examples and newly authored practice emphasize reciprocal steps, equal-capacitor shortcuts and magnitude checks.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19, 20, 21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Identify the arrangement and define the total",
        "source_ids": [
          "S12"
        ]
      },
      {
        "heading": "Parallel capacitance: add directly",
        "source_ids": [
          "S12"
        ]
      },
      {
        "heading": "Series capacitance: preserve both reciprocal stages",
        "source_ids": [
          "S12"
        ]
      },
      {
        "heading": "Two series capacitors: product over sum",
        "source_ids": [
          "S12"
        ]
      },
      {
        "heading": "Equal series capacitors and the source examples",
        "source_ids": [
          "S12"
        ]
      },
      {
        "heading": "Contrast with resistors and check the result",
        "source_ids": [
          "S12",
          "S9"
        ]
      }
    ],
    "objectives": [
      "Calculate parallel capacitance by adding individual capacitances.",
      "Calculate series capacitance by taking the reciprocal of a sum of reciprocals.",
      "Use product-over-sum for two series capacitors and C/n for equal series capacitors.",
      "Distinguish capacitor-combination rules from resistor-combination rules.",
      "Check equivalent capacitance against the individual capacitor values."
    ],
    "html": "<p>Calculate equivalent capacitance using the verified series and parallel rules in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 20–21. Source examples and newly authored practice emphasize reciprocal steps, equal-capacitor shortcuts and magnitude checks.</p><h3>Identify the arrangement and define the total</h3><p>Equivalent capacitance is the single total capacitance assigned to a stated capacitor combination. Write it as C_T, with C_1, C_2 and so on representing the individual capacitances. Capacitance is expressed in farads (F); the examples here use microfarads (µF). All values must be expressed in the same unit before combining them.</p><p></p><p>The verified “Capacitors in Series” material on printed p. 20 and its continuation on printed p. 21 establish two contrasting rules: parallel capacitances add directly, while series capacitances combine through reciprocals. Identify the arrangement before choosing the arithmetic. The same component values can produce different totals depending on their connection.</p><p></p><p>This lesson uses positive capacitance values and the simple series or parallel combinations specified in each exercise. It is written calculation practice, not a construction procedure. No prior lesson completion is required.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.)</p><h3>Parallel capacitance: add directly</h3><p>For parallel capacitors, the source gives C_T = C_1 + C_2 + … + C_n. Add the capacitance values directly, keeping their shared unit.</p><p></p><p>The verified parallel example on printed p. 21 combines two 10 µF capacitors:</p><p>C_T = 10 µF + 10 µF = 20 µF.</p><p></p><p>Newly authored worked example: three parallel capacitors have values of 2 µF, 3 µF and 5 µF. Their total is C_T = 2 + 3 + 5 = 10 µF. Because all inputs use microfarads, the sum is also in microfarads; conversion to farads is unnecessary for this addition.</p><p></p><p>A magnitude check follows from the formula: with two or more positive capacitances, a parallel total must exceed the largest individual value. In the newly authored example, 10 µF exceeds 5 µF. A result below 5 µF would contradict the stated parallel arrangement. This check is an instructional consequence of the verified rule, not an additional book example.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.)</p><h3>Series capacitance: preserve both reciprocal stages</h3><p>For series capacitors, the verified rule is C_T = 1/(1/C_1 + 1/C_2 + … + 1/C_n). A reciprocal means one divided by a value. Keep the calculation in two stages: first add the individual reciprocals, then take the reciprocal of that entire sum.</p><p></p><p>Newly authored worked example: 3 µF and 6 µF are in series. Using microfarads consistently:</p><p>1/C_T = 1/3 + 1/6 = 2/6 + 1/6 = 3/6 = 0.5 µF^-1.</p><p>Then C_T = 1/(0.5 µF^-1) = 2 µF.</p><p></p><p>The intermediate 0.5 is not the final capacitance. Its unit is reciprocal microfarads, µF^-1; the final reciprocal restores microfarads. On a calculator, evaluate the complete denominator before dividing 1 by it.</p><p></p><p>For two or more positive series capacitances, the reciprocal sum exceeds the reciprocal of the smallest capacitance. Taking its reciprocal therefore gives a total below the smallest individual value. Here, 2 µF is below 3 µF, as expected.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.)</p><h3>Two series capacitors: product over sum</h3><p>For exactly two series capacitors, the source supplies the convenient expression C_T = C_1C_2/(C_1 + C_2). It is the same reciprocal rule written differently, not a separate physical relationship.</p><p></p><p>The algebra explains the shortcut: 1/C_1 + 1/C_2 = (C_1 + C_2)/(C_1C_2). Taking the reciprocal gives C_1C_2/(C_1 + C_2).</p><p></p><p>Newly authored worked example: combine 4 µF and 12 µF in series. First calculate the numerator, 4 × 12 = 48, and the denominator, 4 + 12 = 16. Then C_T = 48/16 = 3 µF. The product has units µF²; dividing by the sum in µF leaves µF.</p><p></p><p>Check with the full reciprocal method: 1/C_T = 1/4 + 1/12 = 3/12 + 1/12 = 1/3 µF^-1, giving C_T = 3 µF. The answer is below 4 µF, the smaller input. Use product-over-sum for two capacitors only; for a larger series group, the general reciprocal sum remains available.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.)</p><h3>Equal series capacitors and the source examples</h3><p>For n equal capacitors in series, the source gives C_T = C/n, where C is the capacitance of each capacitor and n is the number of capacitors. The reciprocal sum explains why: n copies of 1/C add to n/C, whose reciprocal is C/n.</p><p></p><p>The verified series example on printed p. 20 uses three 10 µF capacitors:</p><p>C_T = 10/3 µF = 3.333… µF ≈ 3.3 µF.</p><p>The approximation sign matters because 3.3 µF is a shortened decimal representation, not the exact quotient.</p><p></p><p>Contrast this with the verified parallel example of two 10 µF capacitors, which gives 20 µF. For a direct same-count comparison, a newly authored application gives three 10 µF capacitors in parallel as 10 + 10 + 10 = 30 µF, rather than approximately 3.3 µF in series.</p><p></p><p>Check equality before using C/n. If the capacitors differ, dividing one selected capacitance by the number of capacitors is not supported by this shortcut.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.)</p><h3>Contrast with resistors and check the result</h3><p>The resistor rules on printed p. 19 provide a useful contrast: series resistances add, while parallel resistances use a reciprocal sum. Capacitors use the opposite arrangement-to-operation pairing: parallel capacitances add, while series capacitances use a reciprocal sum.</p><p></p><p>Do not transfer a resistor rule merely because a capacitor network has the same arrangement name. First identify the component type, then the connection, then the formula.</p><p></p><p>Newly authored comparison: two equal 8 µF capacitors give 16 µF in parallel and 4 µF in series. Two equal 8 Ω resistors give 16 Ω in series and 4 Ω in parallel. The arithmetic patterns match, but the arrangements and units do not.</p><p></p><p>A final capacitor check is therefore: parallel total above the largest individual capacitance; series total below the smallest, assuming at least two positive values. Then inspect the units and any rounding. These comparisons reinforce formula selection without requiring a repeat of resistor-network calculations.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Capacitors of 1 µF, 2.2 µF and 4.7 µF are connected in parallel. Calculate the total and give a magnitude check.",
        "answer": "C_T = 7.9 µF, greater than the largest individual value.",
        "explanation": "Parallel capacitances add: 1 + 2.2 + 4.7 = 7.9 µF. For these positive values, the total must exceed the largest individual capacitance, 4.7 µF.",
        "source_ids": [
          "S12"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Calculate the total of 2 µF and 6 µF in series using the reciprocal method. Show the intermediate unit.",
        "answer": "The reciprocal sum is 2/3 µF^-1; C_T = 1.5 µF.",
        "explanation": "1/C_T = 1/2 + 1/6 = 3/6 + 1/6 = 2/3 µF^-1. Taking the reciprocal gives C_T = 3/2 = 1.5 µF. It is below the smaller input, 2 µF.",
        "source_ids": [
          "S12"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Find the equivalent capacitance of 5 µF and 20 µF in series using product-over-sum.",
        "answer": "C_T = 4 µF.",
        "explanation": "C_T = (5 × 20)/(5 + 20) = 100/25 = 4 µF. The result is smaller than 5 µF, consistent with the series rule for positive capacitances.",
        "source_ids": [
          "S12"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Practice using the verified source values: Three 10 µF capacitors are connected in series. Give the exact quotient and an approximate result to one decimal place.",
        "answer": "C_T = 10/3 µF ≈ 3.3 µF.",
        "explanation": "The capacitors are equal, so C_T = C/n = 10/3 µF. Its decimal value is 3.333… µF, which rounds to 3.3 µF. This reproduces the verified series example.",
        "source_ids": [
          "S12"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q01",
        "type": "reflection",
        "prompt": "Capacitors of 1 µF, 2.2 µF and 4.7 µF are connected in parallel. Calculate the total and give a magnitude check.",
        "explain": "Parallel capacitances add: 1 + 2.2 + 4.7 = 7.9 µF. For these positive values, the total must exceed the largest individual capacitance, 4.7 µF.",
        "rubric": "Expected answer: C_T = 7.9 µF, greater than the largest individual value.\nReasoning: Parallel capacitances add: 1 + 2.2 + 4.7 = 7.9 µF. For these positive values, the total must exceed the largest individual capacitance, 4.7 µF.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q02",
        "type": "reflection",
        "prompt": "Calculate the total of 2 µF and 6 µF in series using the reciprocal method. Show the intermediate unit.",
        "explain": "1/C_T = 1/2 + 1/6 = 3/6 + 1/6 = 2/3 µF^-1. Taking the reciprocal gives C_T = 3/2 = 1.5 µF. It is below the smaller input, 2 µF.",
        "rubric": "Expected answer: The reciprocal sum is 2/3 µF^-1; C_T = 1.5 µF.\nReasoning: 1/C_T = 1/2 + 1/6 = 3/6 + 1/6 = 2/3 µF^-1. Taking the reciprocal gives C_T = 3/2 = 1.5 µF. It is below the smaller input, 2 µF.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q03",
        "type": "reflection",
        "prompt": "Find the equivalent capacitance of 5 µF and 20 µF in series using product-over-sum.",
        "explain": "C_T = (5 × 20)/(5 + 20) = 100/25 = 4 µF. The result is smaller than 5 µF, consistent with the series rule for positive capacitances.",
        "rubric": "Expected answer: C_T = 4 µF.\nReasoning: C_T = (5 × 20)/(5 + 20) = 100/25 = 4 µF. The result is smaller than 5 µF, consistent with the series rule for positive capacitances.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q04",
        "type": "reflection",
        "prompt": "Practice using the verified source values: Three 10 µF capacitors are connected in series. Give the exact quotient and an approximate result to one decimal place.",
        "explain": "The capacitors are equal, so C_T = C/n = 10/3 µF. Its decimal value is 3.333… µF, which rounds to 3.3 µF. This reproduces the verified series example.",
        "rubric": "Expected answer: C_T = 10/3 µF ≈ 3.3 µF.\nReasoning: The capacitors are equal, so C_T = C/n = 10/3 µF. Its decimal value is 3.333… µF, which rounds to 3.3 µF. This reproduces the verified series example.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q05",
        "type": "reflection",
        "prompt": "Capacitors of 6 µF, 3 µF and 2 µF are connected in series. Calculate their total.",
        "explain": "1/C_T = 1/6 + 1/3 + 1/2 = 1/6 + 2/6 + 3/6 = 1 µF^-1. Its reciprocal is 1 µF, below the smallest individual value of 2 µF.",
        "rubric": "Expected answer: C_T = 1 µF.\nReasoning: 1/C_T = 1/6 + 1/3 + 1/2 = 1/6 + 2/6 + 3/6 = 1 µF^-1. Its reciprocal is 1 µF, below the smallest individual value of 2 µF.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q06",
        "type": "reflection",
        "prompt": "A learner adds two 12 µF series capacitors and reports 24 µF. Identify the incorrect rule and calculate the correct total.",
        "explain": "Direct addition is the capacitor parallel rule, not the capacitor series rule. Two equal series capacitors give C_T = C/n = 12/2 = 6 µF.",
        "rubric": "Expected answer: The learner used the parallel rule. The correct series total is 6 µF.\nReasoning: Direct addition is the capacitor parallel rule, not the capacitor series rule. Two equal series capacitors give C_T = C/n = 12/2 = 6 µF.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q07",
        "type": "reflection",
        "prompt": "For 4 µF and 4 µF in series, a learner reports the reciprocal sum, 0.5, as 0.5 µF. What step and unit distinction are missing?",
        "explain": "1/4 + 1/4 = 0.5 µF^-1 represents 1/C_T. Taking its reciprocal gives C_T = 1/0.5 = 2 µF. The equal-series shortcut confirms 4/2 = 2 µF.",
        "rubric": "Expected answer: The final reciprocal is missing. The intermediate unit is µF^-1; the correct total is 2 µF.\nReasoning: 1/4 + 1/4 = 0.5 µF^-1 represents 1/C_T. Taking its reciprocal gives C_T = 1/0.5 = 2 µF. The equal-series shortcut confirms 4/2 = 2 µF.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-Q08",
        "type": "reflection",
        "prompt": "Which arrangement uses direct addition for capacitors, and which uses direct addition for resistors? Why should you identify the component type before selecting a rule?",
        "explain": "The verified rules assign direct addition to parallel capacitances and series resistances. Their reciprocal rules apply to the opposite arrangements, so arrangement alone is not enough to choose the operation.",
        "rubric": "Expected answer: Capacitors add directly in parallel; resistors add directly in series. The component type determines which arrangement-to-operation rule applies.\nReasoning: The verified rules assign direct addition to parallel capacitances and series resistances. Their reciprocal rules apply to the opposite arrangements, so arrangement alone is not enough to choose the operation.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-P09",
        "type": "reflection",
        "prompt": "Explain the main idea from “Identify the arrangement and define the total” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Equivalent capacitance is the single total capacitance assigned to a stated capacitor combination. Write it as C_T, with C_1, C_2 and so on representing the individual capacitances. Capacitance is expressed in farads (F); the examples here use microfarads (µF). All values must be expressed in the same unit before combining them.\n\nThe verified “Capacitors in Series” material on printed p. 20 and its continuation on printed p. 21 establish two contrasting rules: parallel capacitances add directly, while series capacitances combine through reciprocals. Identify the arrangement before choosing the arithmetic. The same component values can produce different totals depending on their connection.\n\nThis lesson uses positive capacitance values and the simple series or parallel combinations specified in each exercise. It is written calculation practice, not a construction procedure. No prior lesson completion is required.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10-P10",
        "type": "reflection",
        "prompt": "Use the explanation under “Parallel capacitance: add directly” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "For parallel capacitors, the source gives C_T = C_1 + C_2 + … + C_n. Add the capacitance values directly, keeping their shared unit.\n\nThe verified parallel example on printed p. 21 combines two 10 µF capacitors:\nC_T = 10 µF + 10 µF = 20 µF.\n\nNewly authored worked example: three parallel capacitors have values of 2 µF, 3 µF and 5 µF. Their total is C_T = 2 + 3 + 5 = 10 µF. Because all inputs use microfarads, the sum is also in microfarads; conversion to farads is unnecessary for this addition.\n\nA magnitude check follows from the formula: with two or more positive capacitances, a parallel total must exceed the largest individual value. In the newly authored example, 10 µF exceeds 5 µF. A result below 5 µF would contradict the stated parallel arrangement. This check is an instructional consequence of the verified rule, not an additional book example.",
        "safety": false,
        "source_ids": [
          "S12"
        ]
      }
    ],
    "minutes": 46,
    "simulator": "capnetwork",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U10",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11",
    "generated": true,
    "subtrack": "generated",
    "title": "RC Time Constants and Exponential Response",
    "description": "Calculate an RC time constant and interpret exponential capacitor response using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 21. Worked paper calculations distinguish the accepted one-time-constant charging result from disputed graph labels and completion claims.",
    "module": "Associate CET Study Guide",
    "sourcePages": "20, 21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "What an RC time constant describes",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Verified worked example: 10 kΩ and 5 µF",
        "source_ids": [
          "S11"
        ]
      },
      {
        "heading": "Interpret the one-time-constant charging value",
        "source_ids": [
          "S11"
        ]
      },
      {
        "heading": "Exponential response and the limits of the evidence",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Newly authored practice method: compare the RC product",
        "source_ids": [
          "S11"
        ]
      }
    ],
    "objectives": [
      "Calculate an RC time constant with resistance in ohms and capacitance in farads.",
      "Interpret the time constant as a characteristic response time rather than a completion time.",
      "Use the verified one-time-constant charging example to distinguish capacitor voltage from applied voltage.",
      "Explain qualitatively how exponential charging and discharging differ from constant-rate changes.",
      "Compare how changes in resistance or capacitance affect the time constant."
    ],
    "html": "<p>Calculate an RC time constant and interpret exponential capacitor response using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 21. Worked paper calculations distinguish the accepted one-time-constant charging result from disputed graph labels and completion claims.</p><h3>What an RC time constant describes</h3><p>The “Time Constants” material on printed p. 21 describes exponential capacitor charging and discharging and defines one RC time constant as resistance multiplied by capacitance. An RC response combines resistance, written R, and capacitance, written C. Here R is measured in ohms (Ω), and C is measured in farads (F).</p><p></p><p>Write the time constant as TC, following the extracted formula: TC = RC. TC is a time, measured in seconds (s). It provides a characteristic timescale for the response, not a statement that charging or discharging is complete at that instant.</p><p></p><p>The capacitor charge relation on printed p. 20 is Q = CV, where Q is charge in coulombs and V is capacitor voltage in volts. For fixed capacitance, charge and capacitor voltage change together. This connection helps explain why a discussion of capacitor charging can describe voltage as it changes over time. The new focus here is the timing of that change, not a repeat of charge or energy calculations.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Verified worked example: 10 kΩ and 5 µF</h3><p>The verified worked values on printed p. 21 use R = 10 kΩ and C = 5 µF. Convert both to the units required by TC = RC:</p><p></p><p>R = 10 kΩ = 10000 Ω = 10^4 Ω.</p><p>C = 5 µF = 0.000005 F = 5 × 10^-6 F.</p><p></p><p>Now substitute:</p><p>TC = RC</p><p>TC = 10000 × 0.000005 s</p><p>TC = 0.05 s.</p><p></p><p>Equivalently, multiply the powers of ten: 10^4 × 5 × 10^-6 = 5 × 10^-2 = 0.05. The result is five hundredths of a second, or 50 milliseconds (ms). One millisecond is one thousandth of a second.</p><p></p><p>The unit combination Ω·F corresponds to seconds in this relation. Do not multiply the displayed numbers 10 and 5 and label the result 50 seconds: that would ignore the kilo and micro scale factors. Writing the converted quantities before multiplication makes the scale visible. The calculation reproduces the accepted source result; it does not use the disputed timing labels in Figure 6.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.)</p><h3>Interpret the one-time-constant charging value</h3><p>The accepted charging example on printed p. 21 gives a capacitor voltage of 63.2 V after one charging time constant with 100 V applied. The ratio is 63.2/100 = 0.632, so the displayed capacitor voltage is 63.2% of the applied voltage at that point in the example.</p><p></p><p>This illustrates why one time constant is not a completion time. At that instant, the difference between the applied voltage and capacitor voltage is still 100 − 63.2 = 36.8 V. Keep these quantities separate: 100 V is the applied voltage, 63.2 V is the capacitor voltage, and 36.8 V is their remaining difference.</p><p></p><p>For the verified resistance and capacitance calculation, one time constant is 0.05 s. The accepted examples therefore connect a characteristic time of 0.05 s with the stated one-time-constant charging value. The 63.2 V value is a displayed numerical result, not an exact universal voltage independent of the applied voltage or charging conditions.</p><p></p><p>These are paper calculations only. The extraction does not supply a laboratory procedure for constructing or testing the 100 V example.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.)</p><h3>Exponential response and the limits of the evidence</h3><p>An exponential response does not change by the same number of volts during every equal time interval. In charging, the capacitor voltage approaches its final level with progressively smaller changes. In discharging, it falls toward its final level with progressively smaller changes. Thus a straight-line assumption—such as adding the first interval’s voltage increase repeatedly—does not represent the response described by the source.</p><p></p><p>A larger TC means a longer characteristic timescale; a smaller TC means a shorter one. This comparison concerns timing, not a change in the definition of voltage or charge. For fixed capacitance, Q = CV also means that the changing charge follows the changing capacitor voltage.</p><p></p><p>The extraction flags Figure 6’s first discharge percentage and final time-marker label as questionable. It also flags the unqualified claim of complete charging after five time constants. Those items are not adopted here. We will not use that graph to assign numerical discharge percentages, nor claim exact completion at five time constants. The accepted evidence supports exponential behavior and the stated charging result, but this lesson does not reconstruct a full response table or add an unextracted response equation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Newly authored practice method: compare the RC product</h3><p>The product TC = RC makes timing comparisons straightforward. Holding capacitance fixed, doubling resistance doubles the time constant. Holding resistance fixed, doubling capacitance also doubles it. If both are doubled, the product becomes four times as large. State what remains fixed when making any such comparison.</p><p></p><p>Newly authored worked example: let R = 2000 Ω and C = 10 × 10^-6 F. Then TC = 2000 × 10 × 10^-6 s = 0.02 s. Increasing resistance to 4000 Ω while keeping capacitance unchanged gives TC = 0.04 s. The characteristic response time doubles.</p><p></p><p>For another newly authored comparison, doubling resistance while halving capacitance leaves the product unchanged: (2R)(C/2) = RC. This is an algebraic timing comparison, not a claim that every feature of the two circuits is identical.</p><p></p><p>A useful workflow is to convert the units, multiply R by C, label the result in seconds, and then compare it with the original values. Any response interpretation should remain separate from the arithmetic: calculating TC alone does not establish a complete voltage-versus-time curve.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Practice using the verified source values: Calculate TC for 10 kΩ and 5 µF. Show both conversions and give the result in seconds and milliseconds.",
        "answer": "TC = 10000 × (5 × 10^-6) s = 0.05 s = 50 ms.",
        "explanation": "Convert resistance to 10000 Ω and capacitance to 5 × 10^-6 F. Their product is 0.05 s. Multiplying seconds by 1000 expresses the same time as 50 ms.",
        "source_ids": [
          "S11"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Find the time constant for R = 20 kΩ and C = 2 µF.",
        "answer": "TC = 0.04 s, or 40 ms.",
        "explanation": "Use ohms and farads: R = 20000 Ω and C = 2 × 10^-6 F. TC = 20000 × 2 × 10^-6 = 0.04 s. This is a characteristic time, not a completion time.",
        "source_ids": [
          "S11"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Practice interpreting the verified charging example: With 100 V applied, the capacitor voltage is 63.2 V after one time constant. What percentage of the applied voltage is this, and what voltage difference remains?",
        "answer": "The capacitor voltage is 63.2% of the applied voltage; the remaining difference is 36.8 V.",
        "explanation": "The percentage is (63.2/100) × 100% = 63.2%. Subtract capacitor voltage from applied voltage: 100 − 63.2 = 36.8 V. A nonzero difference remains, so one time constant does not indicate completion.",
        "source_ids": [
          "S11"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A response has TC = 0.03 s. Resistance is tripled while capacitance remains unchanged. What is the new time constant?",
        "answer": "The new time constant is 0.09 s.",
        "explanation": "Because TC = RC, replacing R with 3R multiplies the product by three. The new time constant is 3 × 0.03 = 0.09 s.",
        "source_ids": [
          "S11"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q01",
        "type": "reflection",
        "prompt": "Practice using the verified source values: Calculate TC for 10 kΩ and 5 µF. Show both conversions and give the result in seconds and milliseconds.",
        "explain": "Convert resistance to 10000 Ω and capacitance to 5 × 10^-6 F. Their product is 0.05 s. Multiplying seconds by 1000 expresses the same time as 50 ms.",
        "rubric": "Expected answer: TC = 10000 × (5 × 10^-6) s = 0.05 s = 50 ms.\nReasoning: Convert resistance to 10000 Ω and capacitance to 5 × 10^-6 F. Their product is 0.05 s. Multiplying seconds by 1000 expresses the same time as 50 ms.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q02",
        "type": "reflection",
        "prompt": "Find the time constant for R = 20 kΩ and C = 2 µF.",
        "explain": "Use ohms and farads: R = 20000 Ω and C = 2 × 10^-6 F. TC = 20000 × 2 × 10^-6 = 0.04 s. This is a characteristic time, not a completion time.",
        "rubric": "Expected answer: TC = 0.04 s, or 40 ms.\nReasoning: Use ohms and farads: R = 20000 Ω and C = 2 × 10^-6 F. TC = 20000 × 2 × 10^-6 = 0.04 s. This is a characteristic time, not a completion time.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q03",
        "type": "reflection",
        "prompt": "Practice interpreting the verified charging example: With 100 V applied, the capacitor voltage is 63.2 V after one time constant. What percentage of the applied voltage is this, and what voltage difference remains?",
        "explain": "The percentage is (63.2/100) × 100% = 63.2%. Subtract capacitor voltage from applied voltage: 100 − 63.2 = 36.8 V. A nonzero difference remains, so one time constant does not indicate completion.",
        "rubric": "Expected answer: The capacitor voltage is 63.2% of the applied voltage; the remaining difference is 36.8 V.\nReasoning: The percentage is (63.2/100) × 100% = 63.2%. Subtract capacitor voltage from applied voltage: 100 − 63.2 = 36.8 V. A nonzero difference remains, so one time constant does not indicate completion.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q04",
        "type": "reflection",
        "prompt": "A response has TC = 0.03 s. Resistance is tripled while capacitance remains unchanged. What is the new time constant?",
        "explain": "Because TC = RC, replacing R with 3R multiplies the product by three. The new time constant is 3 × 0.03 = 0.09 s.",
        "rubric": "Expected answer: The new time constant is 0.09 s.\nReasoning: Because TC = RC, replacing R with 3R multiplies the product by three. The new time constant is 3 × 0.03 = 0.09 s.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q05",
        "type": "reflection",
        "prompt": "Resistance doubles while capacitance is halved. How does the time constant change? Does that establish that all circuit behavior is identical?",
        "explain": "The new product is (2R)(C/2) = RC. This establishes equal time constants under the stated comparison, not equality of every other circuit quantity.",
        "rubric": "Expected answer: The time constant is unchanged. That alone does not establish identical behavior in every respect.\nReasoning: The new product is (2R)(C/2) = RC. This establishes equal time constants under the stated comparison, not equality of every other circuit quantity.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q06",
        "type": "reflection",
        "prompt": "A learner argues that the source’s 63.2 V increase during the first charging time constant means another 63.2 V increase must occur during the next equal interval. What is wrong with this reasoning?",
        "explain": "The source describes exponential response rather than a constant-rate voltage increase. Equal time intervals do not imply equal voltage changes. The accepted extraction does not provide a verified second-interval numerical value to substitute.",
        "rubric": "Expected answer: The learner assumes a linear response. Exponential charging has progressively smaller voltage changes, so the first interval’s increase cannot simply be repeated.\nReasoning: The source describes exponential response rather than a constant-rate voltage increase. Equal time intervals do not imply equal voltage changes. The accepted extraction does not provide a verified second-interval numerical value to substitute.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-Q07",
        "type": "reflection",
        "prompt": "At fixed capacitance, why does a changing capacitor voltage imply a changing stored charge? Does this make charge and voltage the same quantity?",
        "explain": "The accepted relation Q = CV makes charge proportional to voltage when C is fixed. Charge is measured in coulombs and voltage in volts, so their linked changes do not make the quantities interchangeable.",
        "rubric": "Expected answer: Q = CV links their changes at fixed capacitance. They remain different quantities with different units.\nReasoning: The accepted relation Q = CV makes charge proportional to voltage when C is fixed. Charge is measured in coulombs and voltage in volts, so their linked changes do not make the quantities interchangeable.",
        "safety": false,
        "source_ids": [
          "S10",
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “What an RC time constant describes” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Time Constants” material on printed p. 21 describes exponential capacitor charging and discharging and defines one RC time constant as resistance multiplied by capacitance. An RC response combines resistance, written R, and capacitance, written C. Here R is measured in ohms (Ω), and C is measured in farads (F).\n\nWrite the time constant as TC, following the extracted formula: TC = RC. TC is a time, measured in seconds (s). It provides a characteristic timescale for the response, not a statement that charging or discharging is complete at that instant.\n\nThe capacitor charge relation on printed p. 20 is Q = CV, where Q is charge in coulombs and V is capacitor voltage in volts. For fixed capacitance, charge and capacitor voltage change together. This connection helps explain why a discussion of capacitor charging can describe voltage as it changes over time. The new focus here is the timing of that change, not a repeat of charge or energy calculations.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Verified worked example: 10 kΩ and 5 µF” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified worked values on printed p. 21 use R = 10 kΩ and C = 5 µF. Convert both to the units required by TC = RC:\n\nR = 10 kΩ = 10000 Ω = 10^4 Ω.\nC = 5 µF = 0.000005 F = 5 × 10^-6 F.\n\nNow substitute:\nTC = RC\nTC = 10000 × 0.000005 s\nTC = 0.05 s.\n\nEquivalently, multiply the powers of ten: 10^4 × 5 × 10^-6 = 5 × 10^-2 = 0.05. The result is five hundredths of a second, or 50 milliseconds (ms). One millisecond is one thousandth of a second.\n\nThe unit combination Ω·F corresponds to seconds in this relation. Do not multiply the displayed numbers 10 and 5 and label the result 50 seconds: that would ignore the kilo and micro scale factors. Writing the converted quantities before multiplication makes the scale visible. The calculation reproduces the accepted source result; it does not use the disputed timing labels in Figure 6.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Interpret the one-time-constant charging value”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The accepted charging example on printed p. 21 gives a capacitor voltage of 63.2 V after one charging time constant with 100 V applied. The ratio is 63.2/100 = 0.632, so the displayed capacitor voltage is 63.2% of the applied voltage at that point in the example.\n\nThis illustrates why one time constant is not a completion time. At that instant, the difference between the applied voltage and capacitor voltage is still 100 − 63.2 = 36.8 V. Keep these quantities separate: 100 V is the applied voltage, 63.2 V is the capacitor voltage, and 36.8 V is their remaining difference.\n\nFor the verified resistance and capacitance calculation, one time constant is 0.05 s. The accepted examples therefore connect a characteristic time of 0.05 s with the stated one-time-constant charging value. The 63.2 V value is a displayed numerical result, not an exact universal voltage independent of the applied voltage or charging conditions.\n\nThese are paper calculations only. The extraction does not supply a laboratory procedure for constructing or testing the 100 V example.",
        "safety": false,
        "source_ids": [
          "S11"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "rc",
    "kind": "mixed",
    "ordering": "sequential",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U11",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12",
    "generated": true,
    "subtrack": "generated",
    "title": "Capacitive Reactance and Phase",
    "description": "Explain capacitive reactance and the current-leading phase relationship using the verified “Capacitive Reactance” material and Figure 7A–C on printed p. 21 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Newly authored paper calculations apply the verified formula without introducing advanced phasor algebra.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "What capacitive reactance measures",
        "source_ids": [
          "S13"
        ]
      },
      {
        "heading": "Worked calculation: evaluate the complete denominator",
        "source_ids": [
          "S13"
        ]
      },
      {
        "heading": "Frequency and capacitance have inverse effects",
        "source_ids": [
          "S13"
        ]
      },
      {
        "heading": "Read current leading voltage by 90°",
        "source_ids": [
          "S13"
        ]
      },
      {
        "heading": "Connect the waveform and phasor views",
        "source_ids": [
          "S13"
        ]
      }
    ],
    "objectives": [
      "Interpret capacitive reactance as opposition to alternating current, measured in ohms.",
      "Calculate capacitive reactance using frequency in hertz and capacitance in farads.",
      "Explain how increasing frequency or capacitance changes capacitive reactance.",
      "Interpret capacitor current leading voltage by 90° in the source’s sinusoidal and phasor views.",
      "Distinguish reactance magnitude from the current–voltage phase relationship."
    ],
    "html": "<p>Explain capacitive reactance and the current-leading phase relationship using the verified “Capacitive Reactance” material and Figure 7A–C on printed p. 21 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Newly authored paper calculations apply the verified formula without introducing advanced phasor algebra.</p><h3>What capacitive reactance measures</h3><p>The “Capacitive Reactance” material on printed p. 21 describes a capacitor’s opposition to alternating current as capacitive reactance. Write this quantity as X_C, where the subscript C identifies the capacitive case. Reactance is measured in ohms (Ω).</p><p></p><p>The source gives X_C = 1/(2πfC). Here f is frequency in hertz (Hz), C is capacitance in farads (F), and π is the dimensionless mathematical constant pi, approximately 3.14159. C inside this equation represents capacitance, not the coulomb unit.</p><p></p><p>Unlike a fixed numerical resistance value, the reactance calculated by this expression depends on frequency as well as capacitance. Consequently, a capacitance value alone is insufficient to determine X_C: the frequency must also be specified.</p><p></p><p>This lesson applies the formula to positive frequency and capacitance values and interprets the source’s sinusoidal phase diagrams. It does not extend the calculation into an arbitrary network or a general waveform analysis.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Worked calculation: evaluate the complete denominator</h3><p>Read the formula as one divided by the entire product 2πfC. Calculate that denominator first, then take its reciprocal. It is not equivalent to dividing by 2π and subsequently multiplying by f and C.</p><p></p><p>The verified extraction supplies the formula but no numerical reactance example to reproduce. The following is newly authored practice: find X_C for f = 1000 Hz and C = 1 µF.</p><p></p><p>First convert capacitance: 1 µF = 1 × 10^-6 F. Substitute:</p><p>X_C = 1/[2π × 1000 × (1 × 10^-6)] Ω.</p><p>The frequency–capacitance product is 1000 × 10^-6 = 0.001. Thus the denominator is 2π × 0.001 ≈ 0.00628319, and X_C ≈ 159.15 Ω, or approximately 159 Ω.</p><p></p><p>On a calculator, use parentheses around the whole denominator: 1 ÷ (2 × π × 1000 × 0.000001). Retain intermediate digits and round the final result. The units Hz and F combine so that the reciprocal expression returns ohms; the final value is a reactance, not a capacitance or frequency.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Frequency and capacitance have inverse effects</h3><p>Frequency appears in the denominator of X_C = 1/(2πfC). Holding capacitance fixed, increasing frequency increases the denominator and decreases reactance. Doubling frequency therefore halves X_C; halving frequency doubles it.</p><p></p><p>Newly authored comparison using C = 1 µF: at 1000 Hz, the preceding calculation gives X_C ≈ 159.15 Ω. At 2000 Hz, X_C = 1/[2π × 2000 × 10^-6] Ω ≈ 79.58 Ω. The doubled frequency produces half the reactance.</p><p></p><p>Capacitance also appears in the denominator. Holding frequency fixed, doubling capacitance halves reactance. For example, at 1000 Hz, increasing capacitance from 1 µF to 2 µF gives approximately 79.58 Ω instead of 159.15 Ω.</p><p></p><p>These are consequences of the verified formula, not additional source examples. Always state what remains fixed. If both frequency and capacitance double, the denominator becomes four times larger and reactance becomes one-quarter as large. A direction check can reveal an error: with one input fixed, a larger value of the other should not produce a larger X_C.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Read current leading voltage by 90°</h3><p>The waveform views in Figure 7 on printed p. 21 show capacitor current leading capacitor voltage by 90°. “Leading” describes relative position within the sinusoidal cycle: corresponding points on the current waveform occur one-quarter of a cycle before those on the voltage waveform. A full cycle is 360°, so 90° is one-quarter of that cycle.</p><p></p><p>This is a comparison between two changing quantities, not a statement that current has a larger amplitude than voltage. Current and voltage have different units, and a phase difference does not specify their numerical amplitudes. Nor does “90°” mean 90 seconds: it expresses cycle position.</p><p></p><p>A useful verbal reading is: current is ahead of voltage by a quarter-cycle; equivalently, voltage lags current by a quarter-cycle. Reversing which quantity leads would reverse the source’s stated relationship.</p><p></p><p>Keep two questions separate. X_C answers how much capacitive opposition the formula assigns at a stated frequency and capacitance. The 90° relationship answers how current and voltage are positioned relative to each other in the source’s sinusoidal representation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Connect the waveform and phasor views</h3><p>Figure 7 also represents the phase relationship with phasors: the current arrow points right, and the voltage arrow points downward. In this introductory view, a phasor is an arrow used to display the relative phase of a sinusoidal quantity. The two arrows are perpendicular, representing a 90° separation.</p><p></p><p>For the source’s particular sketch, read the arrow positions together with its stated relationship: current leads voltage by 90°. The downward voltage arrow does not mean that capacitor voltage is permanently negative. Similarly, the right-pointing current arrow is not a drawing of current physically flowing toward the right in a circuit. These are phase-reference directions.</p><p></p><p>The waveform and phasor views present the same relationship in different forms: one shows variation across a cycle, while the other condenses relative phase into arrow directions. This lesson does not infer arrow-length scales that are absent from the extraction or introduce complex-number calculations.</p><p></p><p>A calculated result such as X_C ≈ 159 Ω is a positive reactance magnitude in this formula. It does not replace the separate statement that current leads voltage. Reporting both magnitude and phase relationship preserves the two distinct pieces of information.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Define X_C, f and C in X_C = 1/(2πfC), including their units. Which entire expression must be evaluated before taking the reciprocal?",
        "answer": "X_C is capacitive reactance in ohms, f is frequency in hertz, and C is capacitance in farads. Evaluate the complete denominator 2πfC, then divide 1 by it.",
        "explanation": "The verified formula assigns reactance in ohms when frequency is in hertz and capacitance is in farads. Parentheses around 2πfC prevent a change in the intended order of operations.",
        "source_ids": [
          "S13"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Calculate capacitive reactance at 500 Hz for a 2 µF capacitor. Show the conversion to farads and round the final answer to the nearest ohm.",
        "answer": "C = 2 × 10^-6 F; X_C ≈ 159 Ω.",
        "explanation": "Convert 2 µF to 2 × 10^-6 F. Then X_C = 1/[2π × 500 × (2 × 10^-6)] Ω. The frequency–capacitance product is 0.001, giving X_C ≈ 159.15 Ω.",
        "source_ids": [
          "S13"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Find X_C at 1000 Hz for a 0.5 µF capacitor. Compare it with the approximately 159 Ω result for 1 µF at the same frequency.",
        "answer": "X_C ≈ 318 Ω, approximately twice the reactance for 1 µF at the same frequency.",
        "explanation": "Use C = 0.5 × 10^-6 F. X_C = 1/[2π × 1000 × (0.5 × 10^-6)] Ω ≈ 318.31 Ω. Halving capacitance at fixed frequency doubles reactance.",
        "source_ids": [
          "S13"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A capacitor has 240 Ω of reactance at a stated frequency. Frequency is tripled while capacitance remains unchanged. What is the new reactance?",
        "answer": "80 Ω.",
        "explanation": "Replacing f with 3f makes the denominator three times larger. The reciprocal therefore becomes one-third as large: 240/3 = 80 Ω.",
        "source_ids": [
          "S13"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q01",
        "type": "reflection",
        "prompt": "Define X_C, f and C in X_C = 1/(2πfC), including their units. Which entire expression must be evaluated before taking the reciprocal?",
        "explain": "The verified formula assigns reactance in ohms when frequency is in hertz and capacitance is in farads. Parentheses around 2πfC prevent a change in the intended order of operations.",
        "rubric": "Expected answer: X_C is capacitive reactance in ohms, f is frequency in hertz, and C is capacitance in farads. Evaluate the complete denominator 2πfC, then divide 1 by it.\nReasoning: The verified formula assigns reactance in ohms when frequency is in hertz and capacitance is in farads. Parentheses around 2πfC prevent a change in the intended order of operations.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q02",
        "type": "reflection",
        "prompt": "Calculate capacitive reactance at 500 Hz for a 2 µF capacitor. Show the conversion to farads and round the final answer to the nearest ohm.",
        "explain": "Convert 2 µF to 2 × 10^-6 F. Then X_C = 1/[2π × 500 × (2 × 10^-6)] Ω. The frequency–capacitance product is 0.001, giving X_C ≈ 159.15 Ω.",
        "rubric": "Expected answer: C = 2 × 10^-6 F; X_C ≈ 159 Ω.\nReasoning: Convert 2 µF to 2 × 10^-6 F. Then X_C = 1/[2π × 500 × (2 × 10^-6)] Ω. The frequency–capacitance product is 0.001, giving X_C ≈ 159.15 Ω.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q03",
        "type": "reflection",
        "prompt": "Find X_C at 1000 Hz for a 0.5 µF capacitor. Compare it with the approximately 159 Ω result for 1 µF at the same frequency.",
        "explain": "Use C = 0.5 × 10^-6 F. X_C = 1/[2π × 1000 × (0.5 × 10^-6)] Ω ≈ 318.31 Ω. Halving capacitance at fixed frequency doubles reactance.",
        "rubric": "Expected answer: X_C ≈ 318 Ω, approximately twice the reactance for 1 µF at the same frequency.\nReasoning: Use C = 0.5 × 10^-6 F. X_C = 1/[2π × 1000 × (0.5 × 10^-6)] Ω ≈ 318.31 Ω. Halving capacitance at fixed frequency doubles reactance.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q04",
        "type": "reflection",
        "prompt": "A capacitor has 240 Ω of reactance at a stated frequency. Frequency is tripled while capacitance remains unchanged. What is the new reactance?",
        "explain": "Replacing f with 3f makes the denominator three times larger. The reciprocal therefore becomes one-third as large: 240/3 = 80 Ω.",
        "rubric": "Expected answer: 80 Ω.\nReasoning: Replacing f with 3f makes the denominator three times larger. The reciprocal therefore becomes one-third as large: 240/3 = 80 Ω.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q05",
        "type": "reflection",
        "prompt": "Frequency doubles and capacitance triples. What fraction of the original capacitive reactance results?",
        "explain": "The new denominator is 2π(2f)(3C), which is six times the original denominator. Reactance becomes one-sixth of its original value.",
        "rubric": "Expected answer: One-sixth of the original reactance.\nReasoning: The new denominator is 2π(2f)(3C), which is six times the original denominator. Reactance becomes one-sixth of its original value.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q06",
        "type": "reflection",
        "prompt": "A learner substitutes C = 2 into the reactance formula for a capacitor labeled 2 µF. Identify the error and explain how it affects the result.",
        "explain": "The formula requires farads. Substituting 2 treats the capacitance as 2 F instead of 2 × 10^-6 F, making the denominator one million times too large and its reciprocal one million times too small.",
        "rubric": "Expected answer: Use C = 2 × 10^-6 F, not 2 F. The learner’s calculated reactance would be one million times too small.\nReasoning: The formula requires farads. Substituting 2 treats the capacitance as 2 F instead of 2 × 10^-6 F, making the denominator one million times too large and its reciprocal one million times too small.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q07",
        "type": "reflection",
        "prompt": "In the source’s sinusoidal capacitor representation, which quantity leads, by how much, and what fraction of a cycle does that represent? Does this establish which waveform has the larger amplitude?",
        "explain": "The source identifies current as leading voltage by 90°. Since 90/360 = 1/4, this is a quarter-cycle relationship. Phase information does not establish amplitude.",
        "rubric": "Expected answer: Current leads voltage by 90°, or one-quarter cycle. No amplitude comparison follows from that phase statement.\nReasoning: The source identifies current as leading voltage by 90°. Since 90/360 = 1/4, this is a quarter-cycle relationship. Phase information does not establish amplitude.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-Q08",
        "type": "reflection",
        "prompt": "Figure 7 places the current phasor to the right and the voltage phasor downward. What does their perpendicular arrangement represent? Does the downward arrow mean voltage is always negative?",
        "explain": "The arrows summarize the source’s 90° phase separation and current-leading relationship. A phasor direction is a phase-reference direction, not a permanent instantaneous voltage sign.",
        "rubric": "Expected answer: It represents a 90° phase separation, with current leading voltage as stated by the source. The downward voltage phasor does not mean voltage is always negative.\nReasoning: The arrows summarize the source’s 90° phase separation and current-leading relationship. A phasor direction is a phase-reference direction, not a permanent instantaneous voltage sign.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-P09",
        "type": "reflection",
        "prompt": "Explain the main idea from “What capacitive reactance measures” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Capacitive Reactance” material on printed p. 21 describes a capacitor’s opposition to alternating current as capacitive reactance. Write this quantity as X_C, where the subscript C identifies the capacitive case. Reactance is measured in ohms (Ω).\n\nThe source gives X_C = 1/(2πfC). Here f is frequency in hertz (Hz), C is capacitance in farads (F), and π is the dimensionless mathematical constant pi, approximately 3.14159. C inside this equation represents capacitance, not the coulomb unit.\n\nUnlike a fixed numerical resistance value, the reactance calculated by this expression depends on frequency as well as capacitance. Consequently, a capacitance value alone is insufficient to determine X_C: the frequency must also be specified.\n\nThis lesson applies the formula to positive frequency and capacitance values and interprets the source’s sinusoidal phase diagrams. It does not extend the calculation into an arbitrary network or a general waveform analysis.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12-P10",
        "type": "reflection",
        "prompt": "Use the explanation under “Worked calculation: evaluate the complete denominator” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Read the formula as one divided by the entire product 2πfC. Calculate that denominator first, then take its reciprocal. It is not equivalent to dividing by 2π and subsequently multiplying by f and C.\n\nThe verified extraction supplies the formula but no numerical reactance example to reproduce. The following is newly authored practice: find X_C for f = 1000 Hz and C = 1 µF.\n\nFirst convert capacitance: 1 µF = 1 × 10^-6 F. Substitute:\nX_C = 1/[2π × 1000 × (1 × 10^-6)] Ω.\nThe frequency–capacitance product is 1000 × 10^-6 = 0.001. Thus the denominator is 2π × 0.001 ≈ 0.00628319, and X_C ≈ 159.15 Ω, or approximately 159 Ω.\n\nOn a calculator, use parentheses around the whole denominator: 1 ÷ (2 × π × 1000 × 0.000001). Retain intermediate digits and round the final result. The units Hz and F combine so that the reciprocal expression returns ohms; the final value is a reactance, not a capacitance or frequency.",
        "safety": false,
        "source_ids": [
          "S13"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "xc",
    "kind": "mixed",
    "ordering": "sequential",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U12",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13",
    "generated": true,
    "subtrack": "generated",
    "title": "Inductance and Combining Inductors",
    "description": "Introduce inductance and interpret the chapter’s simple inductor-combination examples using verified evidence from printed p. 22 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Written practice keeps simple combination calculations separate from the incompletely specified mutual-inductance discussion.",
    "module": "Associate CET Study Guide",
    "sourcePages": "22",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Inductance concerns changes in current",
        "source_ids": [
          "S14"
        ]
      },
      {
        "heading": "The source’s simple series example",
        "source_ids": [
          "S15"
        ]
      },
      {
        "heading": "The simple parallel example and its limits",
        "source_ids": [
          "S15"
        ]
      },
      {
        "heading": "Magnetic interaction qualifies the arithmetic",
        "source_ids": [
          "S15"
        ]
      }
    ],
    "objectives": [
      "Explain inductance as opposition to changes in current rather than opposition to current itself.",
      "Identify inductance values expressed in henrys and millihenrys.",
      "Reproduce the source’s simple series and parallel inductor examples.",
      "Distinguish reinforcing from opposing magnetic-field relationships.",
      "Recognize when mutual inductance prevents unqualified use of simple combination rules."
    ],
    "html": "<p>Introduce inductance and interpret the chapter’s simple inductor-combination examples using verified evidence from printed p. 22 of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET. Written practice keeps simple combination calculations separate from the incompletely specified mutual-inductance discussion.</p><h3>Inductance concerns changes in current</h3><p>The “Inductance” material on printed p. 22 describes inductance as opposition to changes in current. Inductance is measured in henrys, abbreviated H. Use L as the symbol for an inductance value in this lesson. A millihenry, written mH, is one thousandth of a henry: 4 mH = 0.004 H.</p><p></p><p>The word “changes” matters. Saying that inductance opposes changing current is not the same as saying that it simply prevents current from flowing. The source identifies a response to current changing, rather than defining inductance as an ordinary resistance value. Keep the quantity and unit distinct: an inductance value is expressed in henrys, not ohms.</p><p></p><p>This lesson focuses on inductance and component combinations. The page also discusses frequency-dependent inductive reactance, but calculating that separate quantity is outside this selected unit. An inductance value such as 4 mH should not be relabeled as a reactance value.</p><p></p><p>All examples here are written calculations. No construction, measurement procedure, or learner completion requirement is implied.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>The source’s simple series example</h3><p>The verified simple series example on printed p. 22 combines three 4 mH inductors and gives 12 mH. Its arithmetic is direct addition:</p><p></p><p>L_total = 4 mH + 4 mH + 4 mH = 12 mH.</p><p></p><p>Here L_total names the equivalent inductance of the stated combination. All terms use the same unit, so the sum remains in millihenrys. A unit check gives the same result in henrys: 0.004 + 0.004 + 0.004 = 0.012 H = 12 mH.</p><p></p><p>For written practice, direct addition will be used only in a stated simple model that neglects mutual-inductance effects. That assumption is important: the same source discussion distinguishes reinforcing and opposing magnetic fields and introduces a mutual-inductance adjustment. Therefore, the numerical example must not be turned into an unconditional claim that every set of series inductors has a total equal to the sum of its individual values.</p><p></p><p>Newly authored application under the stated simple model: two 3 mH inductors in series give 3 + 3 = 6 mH. This is instructional arithmetic, not another extracted book example.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p><h3>The simple parallel example and its limits</h3><p>The verified simple parallel example on printed p. 22 gives approximately 1.3 mH for three 4 mH inductors. The upper-right wording is partly cropped, so this lesson uses the accepted numerical result without reconstructing the missing text.</p><p></p><p>For the equal-inductor practice model used here, neglect mutual-inductance effects and divide the individual inductance by the number of equal parallel inductors:</p><p></p><p>L_total = L/n,</p><p></p><p>where L is each individual inductance and n is the number of equal inductors. With L = 4 mH and n = 3, L_total = 4/3 mH = 1.333… mH ≈ 1.3 mH, matching the accepted source result. The approximation sign distinguishes the displayed decimal from the exact quotient.</p><p></p><p>Newly authored application of this explicitly limited model: three equal 6 mH inductors in parallel give 6/3 = 2 mH. Do not use this practice shortcut for unequal inductors or for an unspecified magnetically coupled arrangement.</p><p></p><p>The extraction does not fully establish the coupling assumptions behind the source’s parallel discussion. We therefore do not teach a general coupled-inductor parallel formula from it.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p><h3>Magnetic interaction qualifies the arithmetic</h3><p>The series-inductor discussion on printed p. 22 distinguishes magnetic fields that reinforce from fields that oppose and introduces mutual inductance as an adjustment to the simple combination calculation. Reinforcing means that the magnetic-field contributions support one another; opposing means that they act against one another. These are different relationships, so they cannot be ignored when the source says a mutual-inductance adjustment is involved.</p><p></p><p>The useful conceptual distinction is between an isolated arithmetic model and a combination whose magnetic interaction matters. Knowing only the individual inductance values and the word “series” or “parallel” does not always establish the equivalent inductance when mutual effects are present.</p><p></p><p>The verified extraction does not supply enough detail to calculate a general coupled arrangement or reconstruct every adjustment. This lesson therefore does not invent a mutual-inductance equation, coupling value, or connection diagram.</p><p></p><p>Before calculating, ask: Are the inductors in series or parallel? Are their values equal if using the equal-parallel shortcut? Does the problem explicitly permit neglecting mutual effects? If that last assumption is absent and coupling matters, state the limitation rather than reporting an unsupported total.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "What change does inductance oppose, and what unit measures inductance? Explain why “inductance prevents current” is an inaccurate replacement for the source’s description.",
        "answer": "Inductance opposes changes in current and is measured in henrys (H). It is not described as simply preventing current.",
        "explanation": "The source describes opposition to changes in current. Removing the word “changes” incorrectly turns that description into a blanket claim about current flowing.",
        "source_ids": [
          "S14"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Practice using the verified source values: Reproduce the simple series total for three 4 mH inductors. Give the result in mH and H, and state the limitation on using direct addition.",
        "answer": "12 mH = 0.012 H. Direct addition is used here only in the simple model that neglects mutual-inductance effects.",
        "explanation": "The arithmetic is 4 + 4 + 4 = 12 mH. Since 1 mH = 0.001 H, this is 0.012 H. The source also introduces mutual-inductance adjustments, so the simple sum is not an unconditional rule for coupled arrangements.",
        "source_ids": [
          "S14",
          "S15"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Practice using the verified source values: For three equal 4 mH inductors in the stated simple parallel model, calculate the exact quotient and round to one decimal place.",
        "answer": "L_total = 4/3 mH ≈ 1.3 mH.",
        "explanation": "Under the explicitly limited equal-parallel model, divide each inductance by the number of inductors: 4/3 mH = 1.333… mH. Rounding gives approximately 1.3 mH, matching the accepted source result.",
        "source_ids": [
          "S15"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "Three equal 9 mH inductors are considered in two arrangements. Neglect mutual-inductance effects. Find the simple series total and the equal-parallel total.",
        "answer": "Series: 27 mH. Equal parallel: 3 mH, under the stated no-mutual-effects model.",
        "explanation": "The stated assumption permits the simple arithmetic models. Series gives 9 + 9 + 9 = 27 mH. Equal parallel gives 9/3 = 3 mH. The different totals belong to different arrangements.",
        "source_ids": [
          "S15"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q01",
        "type": "reflection",
        "prompt": "What change does inductance oppose, and what unit measures inductance? Explain why “inductance prevents current” is an inaccurate replacement for the source’s description.",
        "explain": "The source describes opposition to changes in current. Removing the word “changes” incorrectly turns that description into a blanket claim about current flowing.",
        "rubric": "Expected answer: Inductance opposes changes in current and is measured in henrys (H). It is not described as simply preventing current.\nReasoning: The source describes opposition to changes in current. Removing the word “changes” incorrectly turns that description into a blanket claim about current flowing.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q02",
        "type": "reflection",
        "prompt": "Practice using the verified source values: Reproduce the simple series total for three 4 mH inductors. Give the result in mH and H, and state the limitation on using direct addition.",
        "explain": "The arithmetic is 4 + 4 + 4 = 12 mH. Since 1 mH = 0.001 H, this is 0.012 H. The source also introduces mutual-inductance adjustments, so the simple sum is not an unconditional rule for coupled arrangements.",
        "rubric": "Expected answer: 12 mH = 0.012 H. Direct addition is used here only in the simple model that neglects mutual-inductance effects.\nReasoning: The arithmetic is 4 + 4 + 4 = 12 mH. Since 1 mH = 0.001 H, this is 0.012 H. The source also introduces mutual-inductance adjustments, so the simple sum is not an unconditional rule for coupled arrangements.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q03",
        "type": "reflection",
        "prompt": "Practice using the verified source values: For three equal 4 mH inductors in the stated simple parallel model, calculate the exact quotient and round to one decimal place.",
        "explain": "Under the explicitly limited equal-parallel model, divide each inductance by the number of inductors: 4/3 mH = 1.333… mH. Rounding gives approximately 1.3 mH, matching the accepted source result.",
        "rubric": "Expected answer: L_total = 4/3 mH ≈ 1.3 mH.\nReasoning: Under the explicitly limited equal-parallel model, divide each inductance by the number of inductors: 4/3 mH = 1.333… mH. Rounding gives approximately 1.3 mH, matching the accepted source result.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q04",
        "type": "reflection",
        "prompt": "Three equal 9 mH inductors are considered in two arrangements. Neglect mutual-inductance effects. Find the simple series total and the equal-parallel total.",
        "explain": "The stated assumption permits the simple arithmetic models. Series gives 9 + 9 + 9 = 27 mH. Equal parallel gives 9/3 = 3 mH. The different totals belong to different arrangements.",
        "rubric": "Expected answer: Series: 27 mH. Equal parallel: 3 mH, under the stated no-mutual-effects model.\nReasoning: The stated assumption permits the simple arithmetic models. Series gives 9 + 9 + 9 = 27 mH. Equal parallel gives 9/3 = 3 mH. The different totals belong to different arrangements.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q05",
        "type": "reflection",
        "prompt": "A learner claims that three equal inductors always have a parallel total of one-third of an individual inductance, even when magnetic coupling is unspecified. What qualification is missing?",
        "explain": "The source’s mutual-inductance discussion signals that magnetic interaction can require additional treatment. Its parallel coupling assumptions are incompletely specified, so the simple example cannot establish a universal coupled-inductor rule.",
        "rubric": "Expected answer: The claim must be limited to the stated simple model neglecting mutual-inductance effects. An unspecified coupled arrangement does not justify that unconditional total.\nReasoning: The source’s mutual-inductance discussion signals that magnetic interaction can require additional treatment. Its parallel coupling assumptions are incompletely specified, so the simple example cannot establish a universal coupled-inductor rule.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-Q06",
        "type": "reflection",
        "prompt": "What distinction does the source make between reinforcing and opposing magnetic fields? Does the verified extraction provide enough information to calculate every resulting coupled-inductor total?",
        "explain": "The source introduces the distinction and a mutual-inductance adjustment, but the accepted extraction does not establish a complete general calculation method. Recognizing that limit is part of interpreting the evidence correctly.",
        "rubric": "Expected answer: Reinforcing fields support one another; opposing fields act against one another. No—the extraction does not provide enough detail for every coupled-inductor calculation.\nReasoning: The source introduces the distinction and a mutual-inductance adjustment, but the accepted extraction does not establish a complete general calculation method. Recognizing that limit is part of interpreting the evidence correctly.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-P07",
        "type": "reflection",
        "prompt": "Explain the main idea from “Inductance concerns changes in current” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Inductance” material on printed p. 22 describes inductance as opposition to changes in current. Inductance is measured in henrys, abbreviated H. Use L as the symbol for an inductance value in this lesson. A millihenry, written mH, is one thousandth of a henry: 4 mH = 0.004 H.\n\nThe word “changes” matters. Saying that inductance opposes changing current is not the same as saying that it simply prevents current from flowing. The source identifies a response to current changing, rather than defining inductance as an ordinary resistance value. Keep the quantity and unit distinct: an inductance value is expressed in henrys, not ohms.\n\nThis lesson focuses on inductance and component combinations. The page also discusses frequency-dependent inductive reactance, but calculating that separate quantity is outside this selected unit. An inductance value such as 4 mH should not be relabeled as a reactance value.\n\nAll examples here are written calculations. No construction, measurement procedure, or learner completion requirement is implied.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-P08",
        "type": "reflection",
        "prompt": "Use the explanation under “The source’s simple series example” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified simple series example on printed p. 22 combines three 4 mH inductors and gives 12 mH. Its arithmetic is direct addition:\n\nL_total = 4 mH + 4 mH + 4 mH = 12 mH.\n\nHere L_total names the equivalent inductance of the stated combination. All terms use the same unit, so the sum remains in millihenrys. A unit check gives the same result in henrys: 0.004 + 0.004 + 0.004 = 0.012 H = 12 mH.\n\nFor written practice, direct addition will be used only in a stated simple model that neglects mutual-inductance effects. That assumption is important: the same source discussion distinguishes reinforcing and opposing magnetic fields and introduces a mutual-inductance adjustment. Therefore, the numerical example must not be turned into an unconditional claim that every set of series inductors has a total equal to the sum of its individual values.\n\nNewly authored application under the stated simple model: two 3 mH inductors in series give 3 + 3 = 6 mH. This is instructional arithmetic, not another extracted book example.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-P09",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “The simple parallel example and its limits”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified simple parallel example on printed p. 22 gives approximately 1.3 mH for three 4 mH inductors. The upper-right wording is partly cropped, so this lesson uses the accepted numerical result without reconstructing the missing text.\n\nFor the equal-inductor practice model used here, neglect mutual-inductance effects and divide the individual inductance by the number of equal parallel inductors:\n\nL_total = L/n,\n\nwhere L is each individual inductance and n is the number of equal inductors. With L = 4 mH and n = 3, L_total = 4/3 mH = 1.333… mH ≈ 1.3 mH, matching the accepted source result. The approximation sign distinguishes the displayed decimal from the exact quotient.\n\nNewly authored application of this explicitly limited model: three equal 6 mH inductors in parallel give 6/3 = 2 mH. Do not use this practice shortcut for unequal inductors or for an unspecified magnetically coupled arrangement.\n\nThe extraction does not fully establish the coupling assumptions behind the source’s parallel discussion. We therefore do not teach a general coupled-inductor parallel formula from it.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13-P10",
        "type": "reflection",
        "prompt": "How would you check that you understood “Magnetic interaction qualifies the arithmetic” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The series-inductor discussion on printed p. 22 distinguishes magnetic fields that reinforce from fields that oppose and introduces mutual inductance as an adjustment to the simple combination calculation. Reinforcing means that the magnetic-field contributions support one another; opposing means that they act against one another. These are different relationships, so they cannot be ignored when the source says a mutual-inductance adjustment is involved.\n\nThe useful conceptual distinction is between an isolated arithmetic model and a combination whose magnetic interaction matters. Knowing only the individual inductance values and the word “series” or “parallel” does not always establish the equivalent inductance when mutual effects are present.\n\nThe verified extraction does not supply enough detail to calculate a general coupled arrangement or reconstruct every adjustment. This lesson therefore does not invent a mutual-inductance equation, coupling value, or connection diagram.\n\nBefore calculating, ask: Are the inductors in series or parallel? Are their values equal if using the equal-parallel shortcut? Does the problem explicitly permit neglecting mutual effects? If that last assumption is absent and coupling matters, state the limitation rather than reporting an unsupported total.",
        "safety": false,
        "source_ids": [
          "S15"
        ]
      }
    ],
    "minutes": 34,
    "simulator": "inductors",
    "kind": "mixed",
    "ordering": "independent",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U13",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14",
    "generated": true,
    "subtrack": "generated",
    "title": "Inductive Reactance and Phase",
    "description": "Calculate inductive reactance and interpret voltage leading current using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 22. Compare inductive and capacitive behavior using p. 21 while keeping reactance magnitude separate from phase. The inductive phase angle is not specified in the supplied evidence and is not inferred here.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Inductance and reactance have different units",
        "source_ids": [
          "S14"
        ]
      },
      {
        "heading": "Worked calculation with explicit unit conversions",
        "source_ids": [
          "S14"
        ]
      },
      {
        "heading": "Direct inductive scaling versus inverse capacitive scaling",
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "heading": "Voltage leads current: what the evidence establishes",
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "heading": "Report magnitude and phase separately",
        "source_ids": [
          "S14"
        ]
      }
    ],
    "objectives": [
      "Calculate inductive reactance with frequency in hertz and inductance in henrys.",
      "Convert millihenrys to henrys before substituting into the reactance formula.",
      "Explain how frequency and inductance affect inductive reactance.",
      "Interpret the verified statement that inductor voltage leads current without assigning an unsupported numerical angle.",
      "Compare inductive and capacitive reactance while distinguishing magnitude from phase."
    ],
    "html": "<p>Calculate inductive reactance and interpret voltage leading current using the verified extraction of Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 22. Compare inductive and capacitive behavior using p. 21 while keeping reactance magnitude separate from phase. The inductive phase angle is not specified in the supplied evidence and is not inferred here.</p><h3>Inductance and reactance have different units</h3><p>The “Inductive Reactance” material on printed p. 22 gives a frequency-dependent expression for an inductor’s opposition to alternating current. Write inductive reactance as X_L, where the subscript L identifies the inductive case. Reactance is measured in ohms (Ω), whereas inductance itself is measured in henrys (H).</p><p></p><p>The source gives X_L = 2πfL. Here f is frequency in hertz (Hz), L is inductance in henrys, and π is the dimensionless mathematical constant pi, approximately 3.14159. Use frequency in hertz and inductance in henrys to obtain reactance in ohms.</p><p></p><p>Inductance and inductive reactance are not interchangeable quantities. An inductance of 10 mH identifies L; it does not identify X_L until a frequency is supplied. The same inductance gives different reactance values at different frequencies.</p><p></p><p>The examples below assume positive frequency and inductance values and apply the source’s component formula. They are written calculations, not construction or measurement instructions. Their results should not be treated as the impedance of an unspecified complete circuit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Worked calculation with explicit unit conversions</h3><p>The verified extraction supplies the inductive-reactance formula but no complete numerical example to reproduce. This worked example is newly authored: find X_L for f = 1000 Hz and L = 10 mH.</p><p></p><p>First convert inductance to henrys. The milli prefix means one thousandth, so 10 mH = 10 × 10^-3 H = 0.010 H. Substitute:</p><p></p><p>X_L = 2πfL</p><p>X_L = 2π × 1000 × 0.010 Ω</p><p>X_L = 20π Ω ≈ 62.83 Ω.</p><p></p><p>The intermediate product fL is 1000 × 0.010 = 10. Multiplying by 2π then gives approximately 62.83. On a calculator, enter 2 × π × 1000 × 0.010; do not take the reciprocal. Keep enough intermediate digits and round the final answer.</p><p></p><p>If the frequency is supplied as 1 kHz, convert it to 1000 Hz before this substitution. If 10 mH is incorrectly entered as 10 H, the inductance is made 1000 times too large and the calculated reactance is also 1000 times too large. Writing both converted inputs explicitly helps expose these errors.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Direct inductive scaling versus inverse capacitive scaling</h3><p>In X_L = 2πfL, both frequency and inductance are multiplying factors. Holding inductance fixed, doubling frequency doubles reactance. Holding frequency fixed, doubling inductance also doubles reactance. If both double, reactance becomes four times as large. These are consequences of the verified formula, not additional extracted source examples.</p><p></p><p>Newly authored comparison: retain L = 0.010 H but increase frequency from 1000 Hz to 2000 Hz. The new result is X_L = 2π × 2000 × 0.010 Ω = 40π Ω ≈ 125.66 Ω. This is twice the preceding 62.83 Ω result, allowing for displayed rounding.</p><p></p><p>The capacitive formula on printed p. 21 is X_C = 1/(2πfC), with C in farads. Frequency appears in its denominator, so doubling frequency at fixed capacitance halves capacitive reactance. Thus increasing frequency increases X_L but decreases X_C when the respective component values are fixed.</p><p></p><p>This comparison concerns individual reactance magnitudes. It does not, by itself, determine the behavior of an arbitrary circuit containing both components.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Voltage leads current: what the evidence establishes</h3><p>The text and Figure 9 on printed p. 22 show voltage leading current in the inductive case. “Leading” describes relative position in the waveform cycle: corresponding features of the voltage waveform occur ahead of those of the current waveform. Equivalently, current lags voltage.</p><p></p><p>This statement does not mean that voltage has a larger amplitude than current. Voltage and current have different units, and a phase relationship is not an amplitude comparison. It also does not mean that an inductor’s voltage must always be positive.</p><p></p><p>The supplied S14 evidence verifies which quantity leads, but it does not specify a numerical inductive phase angle. Therefore, this lesson does not assign a degree value or a fraction of a cycle to that lead. A numerical angle would require further verification of the printed source.</p><p></p><p>For comparison, the capacitive evidence on printed p. 21 explicitly states that current leads voltage by 90°. Preserve the distinction in evidence: the inductive case supports “voltage leads current”; the capacitive case supports “current leads voltage by 90°.” Do not transfer the capacitive numerical angle into the inductive statement.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Report magnitude and phase separately</h3><p>Reactance magnitude and phase answer different questions. The formula X_L = 2πfL gives a numerical opposition in ohms at a stated frequency and inductance. The voltage-leading statement identifies the relative waveform order. Calculating one does not replace reporting the other.</p><p></p><p>Newly authored reporting example: for a 10 mH inductor at 1000 Hz, write, “The inductive reactance is approximately 62.83 Ω; the source’s inductive representation shows voltage leading current.” This gives both the calculated magnitude and the verified qualitative phase relationship without inventing an angle.</p><p></p><p>A reliable calculation workflow is to identify the component, write its formula, convert the inputs to hertz and henrys, substitute, and label the answer in ohms. Then report phase separately using only the relationship established by the evidence.</p><p></p><p>For a final direction check, ask what changed. At fixed inductance, a higher frequency must produce a higher X_L. At fixed frequency, a lower inductance must produce a lower X_L. If your result goes the opposite way, check for an accidental reciprocal or a missed prefix conversion.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Define X_L, f and L in X_L = 2πfL, including their units. Why is a value of L alone insufficient to calculate X_L?",
        "answer": "X_L is inductive reactance in ohms, f is frequency in hertz, and L is inductance in henrys. Frequency must also be specified to calculate reactance.",
        "explanation": "The formula contains both frequency and inductance. Specifying the inductance without frequency leaves one required input unknown. Henry and ohm label different quantities.",
        "source_ids": [
          "S14"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Calculate X_L for 500 Hz and 20 mH. Show the conversion to henrys and round the result to two decimal places.",
        "answer": "L = 0.020 H; X_L ≈ 62.83 Ω.",
        "explanation": "Convert 20 mH to 0.020 H. Then X_L = 2π × 500 × 0.020 Ω = 20π Ω ≈ 62.83 Ω. The calculation multiplies by 2π rather than taking a reciprocal.",
        "source_ids": [
          "S14"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Find the inductive reactance of a 5 mH inductor at 2 kHz. Show both input conversions.",
        "answer": "f = 2000 Hz; L = 0.005 H; X_L ≈ 62.83 Ω.",
        "explanation": "Convert 2 kHz to 2000 Hz and 5 mH to 0.005 H. Substitute X_L = 2π × 2000 × 0.005 Ω = 20π Ω ≈ 62.83 Ω.",
        "source_ids": [
          "S14"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "An inductor has 40 Ω of reactance at a stated frequency. Frequency triples while inductance remains fixed. What is the new reactance? What happens if inductance also doubles?",
        "answer": "With frequency tripled, X_L = 120 Ω. If inductance also doubles, X_L = 240 Ω.",
        "explanation": "Reactance is directly proportional to each input. Tripling frequency multiplies 40 Ω by three. Doubling inductance as well multiplies the original result by six.",
        "source_ids": [
          "S14"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q01",
        "type": "reflection",
        "prompt": "Define X_L, f and L in X_L = 2πfL, including their units. Why is a value of L alone insufficient to calculate X_L?",
        "explain": "The formula contains both frequency and inductance. Specifying the inductance without frequency leaves one required input unknown. Henry and ohm label different quantities.",
        "rubric": "Expected answer: X_L is inductive reactance in ohms, f is frequency in hertz, and L is inductance in henrys. Frequency must also be specified to calculate reactance.\nReasoning: The formula contains both frequency and inductance. Specifying the inductance without frequency leaves one required input unknown. Henry and ohm label different quantities.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q02",
        "type": "reflection",
        "prompt": "Calculate X_L for 500 Hz and 20 mH. Show the conversion to henrys and round the result to two decimal places.",
        "explain": "Convert 20 mH to 0.020 H. Then X_L = 2π × 500 × 0.020 Ω = 20π Ω ≈ 62.83 Ω. The calculation multiplies by 2π rather than taking a reciprocal.",
        "rubric": "Expected answer: L = 0.020 H; X_L ≈ 62.83 Ω.\nReasoning: Convert 20 mH to 0.020 H. Then X_L = 2π × 500 × 0.020 Ω = 20π Ω ≈ 62.83 Ω. The calculation multiplies by 2π rather than taking a reciprocal.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q03",
        "type": "reflection",
        "prompt": "Find the inductive reactance of a 5 mH inductor at 2 kHz. Show both input conversions.",
        "explain": "Convert 2 kHz to 2000 Hz and 5 mH to 0.005 H. Substitute X_L = 2π × 2000 × 0.005 Ω = 20π Ω ≈ 62.83 Ω.",
        "rubric": "Expected answer: f = 2000 Hz; L = 0.005 H; X_L ≈ 62.83 Ω.\nReasoning: Convert 2 kHz to 2000 Hz and 5 mH to 0.005 H. Substitute X_L = 2π × 2000 × 0.005 Ω = 20π Ω ≈ 62.83 Ω.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q04",
        "type": "reflection",
        "prompt": "An inductor has 40 Ω of reactance at a stated frequency. Frequency triples while inductance remains fixed. What is the new reactance? What happens if inductance also doubles?",
        "explain": "Reactance is directly proportional to each input. Tripling frequency multiplies 40 Ω by three. Doubling inductance as well multiplies the original result by six.",
        "rubric": "Expected answer: With frequency tripled, X_L = 120 Ω. If inductance also doubles, X_L = 240 Ω.\nReasoning: Reactance is directly proportional to each input. Tripling frequency multiplies 40 Ω by three. Doubling inductance as well multiplies the original result by six.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q05",
        "type": "reflection",
        "prompt": "A learner substitutes L = 8 for an inductor labeled 8 mH while using frequency in hertz. What value should be substituted, and how does the error affect the calculated reactance?",
        "explain": "The formula requires henrys. Using 8 instead of 0.008 makes L 1000 times too large. Because L is a multiplying factor, X_L becomes 1000 times too large too.",
        "rubric": "Expected answer: Substitute L = 0.008 H. The learner’s reactance would be 1000 times too large.\nReasoning: The formula requires henrys. Using 8 instead of 0.008 makes L 1000 times too large. Because L is a multiplying factor, X_L becomes 1000 times too large too.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q06",
        "type": "reflection",
        "prompt": "Frequency doubles while inductance and capacitance remain fixed. Compare the changes in X_L and X_C.",
        "explain": "Frequency multiplies the inductive expression but appears in the denominator of the capacitive expression. The two magnitudes therefore change in opposite directions.",
        "rubric": "Expected answer: X_L doubles; X_C halves.\nReasoning: Frequency multiplies the inductive expression but appears in the denominator of the capacitive expression. The two magnitudes therefore change in opposite directions.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-Q07",
        "type": "reflection",
        "prompt": "Which quantity leads in the verified inductive representation? Does the supplied inductive evidence establish a numerical phase angle or an amplitude comparison?",
        "explain": "S14 establishes voltage leading current but supplies no numerical angle. Leading and lagging describe relative cycle position rather than waveform amplitude.",
        "rubric": "Expected answer: Voltage leads current, or equivalently current lags voltage. The supplied evidence establishes neither a numerical inductive phase angle nor an amplitude comparison.\nReasoning: S14 establishes voltage leading current but supplies no numerical angle. Leading and lagging describe relative cycle position rather than waveform amplitude.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “Inductance and reactance have different units” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Inductive Reactance” material on printed p. 22 gives a frequency-dependent expression for an inductor’s opposition to alternating current. Write inductive reactance as X_L, where the subscript L identifies the inductive case. Reactance is measured in ohms (Ω), whereas inductance itself is measured in henrys (H).\n\nThe source gives X_L = 2πfL. Here f is frequency in hertz (Hz), L is inductance in henrys, and π is the dimensionless mathematical constant pi, approximately 3.14159. Use frequency in hertz and inductance in henrys to obtain reactance in ohms.\n\nInductance and inductive reactance are not interchangeable quantities. An inductance of 10 mH identifies L; it does not identify X_L until a frequency is supplied. The same inductance gives different reactance values at different frequencies.\n\nThe examples below assume positive frequency and inductance values and apply the source’s component formula. They are written calculations, not construction or measurement instructions. Their results should not be treated as the impedance of an unspecified complete circuit.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Worked calculation with explicit unit conversions” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The verified extraction supplies the inductive-reactance formula but no complete numerical example to reproduce. This worked example is newly authored: find X_L for f = 1000 Hz and L = 10 mH.\n\nFirst convert inductance to henrys. The milli prefix means one thousandth, so 10 mH = 10 × 10^-3 H = 0.010 H. Substitute:\n\nX_L = 2πfL\nX_L = 2π × 1000 × 0.010 Ω\nX_L = 20π Ω ≈ 62.83 Ω.\n\nThe intermediate product fL is 1000 × 0.010 = 10. Multiplying by 2π then gives approximately 62.83. On a calculator, enter 2 × π × 1000 × 0.010; do not take the reciprocal. Keep enough intermediate digits and round the final answer.\n\nIf the frequency is supplied as 1 kHz, convert it to 1000 Hz before this substitution. If 10 mH is incorrectly entered as 10 H, the inductance is made 1000 times too large and the calculated reactance is also 1000 times too large. Writing both converted inputs explicitly helps expose these errors.",
        "safety": false,
        "source_ids": [
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Direct inductive scaling versus inverse capacitive scaling”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "In X_L = 2πfL, both frequency and inductance are multiplying factors. Holding inductance fixed, doubling frequency doubles reactance. Holding frequency fixed, doubling inductance also doubles reactance. If both double, reactance becomes four times as large. These are consequences of the verified formula, not additional extracted source examples.\n\nNewly authored comparison: retain L = 0.010 H but increase frequency from 1000 Hz to 2000 Hz. The new result is X_L = 2π × 2000 × 0.010 Ω = 40π Ω ≈ 125.66 Ω. This is twice the preceding 62.83 Ω result, allowing for displayed rounding.\n\nThe capacitive formula on printed p. 21 is X_C = 1/(2πfC), with C in farads. Frequency appears in its denominator, so doubling frequency at fixed capacitance halves capacitive reactance. Thus increasing frequency increases X_L but decreases X_C when the respective component values are fixed.\n\nThis comparison concerns individual reactance magnitudes. It does not, by itself, determine the behavior of an arbitrary circuit containing both components.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "xl",
    "kind": "mixed",
    "ordering": "sequential",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U14",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15",
    "generated": true,
    "subtrack": "generated",
    "title": "Series-RLC Impedance and Phasor Interpretation",
    "description": "Combine resistance and opposing reactances in a series-RLC circuit using the verified example in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 23. Distinguish impedance magnitude from capacitive or inductive predominance, with newly authored paper exercises.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22, 23",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Define the series-circuit quantities",
        "source_ids": [
          "S16"
        ]
      },
      {
        "heading": "Interpret the reactive difference before squaring",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Magnitude combines squared contributions",
        "source_ids": [
          "S16"
        ]
      },
      {
        "heading": "Verified example: 3 Ω, 16 Ω and 20 Ω",
        "source_ids": [
          "S16"
        ]
      },
      {
        "heading": "Fresh comparisons: equal magnitude, different predominance",
        "source_ids": [
          "S16"
        ]
      }
    ],
    "objectives": [
      "Calculate the difference between capacitive and inductive reactance in a stated series-RLC circuit.",
      "Calculate series-RLC impedance magnitude using the verified square-root formula.",
      "Identify capacitive or inductive predominance from the individual reactance values.",
      "Distinguish positive impedance magnitude from a signed reactive difference.",
      "Check arithmetic, units and the scope of the series-circuit formula."
    ],
    "html": "<p>Combine resistance and opposing reactances in a series-RLC circuit using the verified example in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed p. 23. Distinguish impedance magnitude from capacitive or inductive predominance, with newly authored paper exercises.</p><h3>Define the series-circuit quantities</h3><p>The “Impedance” example on printed p. 23 combines resistance, inductive reactance and capacitive reactance in a series-RLC circuit. Here “RLC” identifies the resistive, inductive and capacitive parts. Define R as resistance, X_L as inductive reactance, X_C as capacitive reactance, and Z as impedance magnitude. All four values in this calculation are expressed in ohms (Ω).</p><p></p><p>The verified formula is:</p><p>Z = √((X_C − X_L)² + R²).</p><p></p><p>The square root covers the entire sum, including both squared terms. Z here is a magnitude: it describes the size of the combined opposition, not whether the circuit is predominantly capacitive or inductive.</p><p></p><p>Use this expression for the stated series-RLC arrangement. This lesson does not provide a general parallel-network expression or a method for arbitrary mixed networks. Its examples assume that resistance and both reactances are already supplied for the same operating frequency.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.)</p><h3>Interpret the reactive difference before squaring</h3><p>The source’s phase descriptions explain why the reactive contributions must be distinguished rather than simply added as positive numbers. Printed p. 21 shows capacitor current leading voltage by 90°. Printed p. 22 shows inductor voltage leading current. These are different current–voltage relationships. The series example on p. 23 combines their opposing reactive contributions through a difference.</p><p></p><p>For this lesson, define a calculation quantity D = X_C − X_L, in ohms. This is an instructional label for the difference used in the source formula, not a new source symbol.</p><p></p><p>If X_C exceeds X_L, D is positive under this chosen subtraction order and the circuit is predominantly capacitive. If X_L exceeds X_C, D is negative and the circuit is predominantly inductive. If the values are equal, D is zero.</p><p></p><p>The sign depends on which subtraction order you choose. Therefore, report predominance with words and the original reactance comparison, rather than relying on an unexplained sign. The supplied inductive evidence does not specify a numerical phase angle, and this lesson does not infer a circuit phase angle.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Magnitude combines squared contributions</h3><p>After calculating D = X_C − X_L, the magnitude calculation becomes Z = √(D² + R²). Squaring makes D² nonnegative, whether D was positive or negative. Thus the same resistance and the same absolute reactive difference produce the same impedance magnitude even when the predominant reactive type differs.</p><p></p><p>The p. 23 phasor sketch accompanies the source’s predominantly capacitive example. Use the sketch as a representation of the combination, not as a picture of physical current direction. The square-and-square-root expression combines the resistive contribution with the net reactive contribution; it is not ordinary addition of their magnitudes.</p><p></p><p>For example, a reactive difference of 4 Ω and resistance of 3 Ω produce √(4² + 3²) = 5 Ω, not 4 + 3 = 7 Ω. The squared terms have units Ω², and taking the square root restores Ω.</p><p></p><p>A useful formula-derived check is Z ≥ R and Z ≥ |D| for nonnegative resistance. A result smaller than either contribution indicates an arithmetic or formula-entry error.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.)</p><h3>Verified example: 3 Ω, 16 Ω and 20 Ω</h3><p>The verified worked example on printed p. 23 uses R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω. First compare the reactances: 20 Ω exceeds 16 Ω, so the circuit is predominantly capacitive, as identified by the source’s phasor sketch.</p><p></p><p>Next calculate the difference:</p><p>D = X_C − X_L = 20 − 16 = 4 Ω.</p><p></p><p>Substitute into the magnitude formula:</p><p>Z = √((20 − 16)² + 3²) Ω</p><p>Z = √(4² + 3²) Ω</p><p>Z = √(16 + 9) Ω</p><p>Z = √25 Ω = 5 Ω.</p><p></p><p>The result is 5 Ω impedance magnitude, with capacitive predominance. These are two separate pieces of information. The calculation passes the magnitude checks: 5 Ω is greater than both the 3 Ω resistance and the 4 Ω reactive difference.</p><p></p><p>Do not add 3 + 16 + 20, and do not stop after finding the difference. The first would ignore the source’s reactive opposition and magnitude formula; the second would omit the resistance contribution.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.)</p><h3>Fresh comparisons: equal magnitude, different predominance</h3><p>Newly authored worked comparison: retain R = 3 Ω but exchange the reactances, so X_L = 20 Ω and X_C = 16 Ω. Now D = 16 − 20 = −4 Ω. Since inductive reactance is larger, the circuit is predominantly inductive.</p><p></p><p>Calculate magnitude separately:</p><p>Z = √((−4)² + 3²) Ω</p><p>Z = √(16 + 9) Ω = 5 Ω.</p><p></p><p>The magnitude matches the source example, but the predominance does not. Squaring removes the difference’s sign; it does not erase the physical distinction expressed by the reactance comparison. In particular, (−4)² = 16, not −16.</p><p></p><p>For another newly authored case, let R = 8 Ω and both reactances equal 12 Ω. Their difference is zero, so the formula gives Z = √(0² + 8²) = 8 Ω. Neither reactance predominates in this calculation.</p><p></p><p>Use the workflow: identify the series arrangement, compare reactances, calculate their difference, square both contributions, add, take the square root, and report magnitude plus predominance. These are paper calculations, not circuit-building instructions.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "Practice using the verified source values: For R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω in series, calculate the reactive difference and impedance magnitude. Identify the predominant reactive type.",
        "answer": "Reactive difference: 4 Ω. Impedance magnitude: 5 Ω. Predominantly capacitive.",
        "explanation": "The source example uses X_C − X_L = 20 − 16 = 4 Ω. Then Z = √(4² + 3²) = √25 = 5 Ω. Capacitive reactance is larger, so the predominance is capacitive.",
        "source_ids": [
          "S16"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "A series-RLC circuit has R = 6 Ω, X_L = 18 Ω and X_C = 10 Ω. Find D = X_C − X_L, Z, and the predominant reactive type.",
        "answer": "D = −8 Ω; Z = 10 Ω; predominantly inductive.",
        "explanation": "D = 10 − 18 = −8 Ω. Squaring gives (−8)² = 64, so Z = √(64 + 36) = 10 Ω. The larger inductive reactance establishes inductive predominance; the negative D is not a negative impedance magnitude.",
        "source_ids": [
          "S16"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "In a series circuit, R = 5 Ω, X_L = 8 Ω and X_C = 20 Ω. Calculate impedance magnitude and check it against R and the absolute reactive difference.",
        "answer": "Z = 13 Ω, greater than R = 5 Ω and |D| = 12 Ω. Predominantly capacitive.",
        "explanation": "D = 20 − 8 = 12 Ω. Z = √(12² + 5²) = √169 = 13 Ω. It exceeds both 12 Ω and 5 Ω, as required by this magnitude expression.",
        "source_ids": [
          "S16"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "R = 7 Ω and both reactances are 15 Ω in a series-RLC circuit. Find Z and state whether either reactance predominates.",
        "answer": "Z = 7 Ω; neither reactance predominates.",
        "explanation": "Equal reactances give D = 15 − 15 = 0 Ω. The formula reduces to Z = √(0² + 7²) = 7 Ω. Neither reactive contribution exceeds the other.",
        "source_ids": [
          "S16"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q01",
        "type": "reflection",
        "prompt": "Practice using the verified source values: For R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω in series, calculate the reactive difference and impedance magnitude. Identify the predominant reactive type.",
        "explain": "The source example uses X_C − X_L = 20 − 16 = 4 Ω. Then Z = √(4² + 3²) = √25 = 5 Ω. Capacitive reactance is larger, so the predominance is capacitive.",
        "rubric": "Expected answer: Reactive difference: 4 Ω. Impedance magnitude: 5 Ω. Predominantly capacitive.\nReasoning: The source example uses X_C − X_L = 20 − 16 = 4 Ω. Then Z = √(4² + 3²) = √25 = 5 Ω. Capacitive reactance is larger, so the predominance is capacitive.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q02",
        "type": "reflection",
        "prompt": "A series-RLC circuit has R = 6 Ω, X_L = 18 Ω and X_C = 10 Ω. Find D = X_C − X_L, Z, and the predominant reactive type.",
        "explain": "D = 10 − 18 = −8 Ω. Squaring gives (−8)² = 64, so Z = √(64 + 36) = 10 Ω. The larger inductive reactance establishes inductive predominance; the negative D is not a negative impedance magnitude.",
        "rubric": "Expected answer: D = −8 Ω; Z = 10 Ω; predominantly inductive.\nReasoning: D = 10 − 18 = −8 Ω. Squaring gives (−8)² = 64, so Z = √(64 + 36) = 10 Ω. The larger inductive reactance establishes inductive predominance; the negative D is not a negative impedance magnitude.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q03",
        "type": "reflection",
        "prompt": "In a series circuit, R = 5 Ω, X_L = 8 Ω and X_C = 20 Ω. Calculate impedance magnitude and check it against R and the absolute reactive difference.",
        "explain": "D = 20 − 8 = 12 Ω. Z = √(12² + 5²) = √169 = 13 Ω. It exceeds both 12 Ω and 5 Ω, as required by this magnitude expression.",
        "rubric": "Expected answer: Z = 13 Ω, greater than R = 5 Ω and |D| = 12 Ω. Predominantly capacitive.\nReasoning: D = 20 − 8 = 12 Ω. Z = √(12² + 5²) = √169 = 13 Ω. It exceeds both 12 Ω and 5 Ω, as required by this magnitude expression.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q04",
        "type": "reflection",
        "prompt": "R = 7 Ω and both reactances are 15 Ω in a series-RLC circuit. Find Z and state whether either reactance predominates.",
        "explain": "Equal reactances give D = 15 − 15 = 0 Ω. The formula reduces to Z = √(0² + 7²) = 7 Ω. Neither reactive contribution exceeds the other.",
        "rubric": "Expected answer: Z = 7 Ω; neither reactance predominates.\nReasoning: Equal reactances give D = 15 − 15 = 0 Ω. The formula reduces to Z = √(0² + 7²) = 7 Ω. Neither reactive contribution exceeds the other.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q05",
        "type": "reflection",
        "prompt": "A learner obtains D = −8 Ω and R = 6 Ω, then reports Z = −10 Ω because the circuit is predominantly inductive. Correct the result and explain the distinction.",
        "explain": "The formula gives Z = √((−8)² + 6²) = √100 = 10 Ω. Z denotes magnitude. Inductive predominance is reported separately rather than represented by a negative magnitude.",
        "rubric": "Expected answer: Z = 10 Ω, not −10 Ω. The circuit can be predominantly inductive while its impedance magnitude is positive.\nReasoning: The formula gives Z = √((−8)² + 6²) = √100 = 10 Ω. Z denotes magnitude. Inductive predominance is reported separately rather than represented by a negative magnitude.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q06",
        "type": "reflection",
        "prompt": "For the source’s 3 Ω resistance and 4 Ω reactive difference, a learner reports Z = 3 + 4 = 7 Ω. Which operation has been replaced incorrectly?",
        "explain": "The verified series expression requires squaring the two contributions, adding their squares, and taking the square root. It does not add resistance and the absolute reactive difference directly.",
        "rubric": "Expected answer: The square-root combination was replaced by direct addition. Correctly, Z = √(3² + 4²) = 5 Ω.\nReasoning: The verified series expression requires squaring the two contributions, adding their squares, and taking the square root. It does not add resistance and the absolute reactive difference directly.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-Q07",
        "type": "reflection",
        "prompt": "A circuit is described only as a parallel combination with R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω. Can this lesson’s series formula establish a 5 Ω impedance magnitude for it?",
        "explain": "S16 verifies this expression and numerical result for a series-RLC example. Matching component values do not establish matching network behavior when the arrangement changes.",
        "rubric": "Expected answer: No. The verified formula here is for the stated series arrangement, not that parallel network.\nReasoning: S16 verifies this expression and numerical result for a series-RLC example. Matching component values do not establish matching network behavior when the arrangement changes.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-P08",
        "type": "reflection",
        "prompt": "Explain the main idea from “Define the series-circuit quantities” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Impedance” example on printed p. 23 combines resistance, inductive reactance and capacitive reactance in a series-RLC circuit. Here “RLC” identifies the resistive, inductive and capacitive parts. Define R as resistance, X_L as inductive reactance, X_C as capacitive reactance, and Z as impedance magnitude. All four values in this calculation are expressed in ohms (Ω).\n\nThe verified formula is:\nZ = √((X_C − X_L)² + R²).\n\nThe square root covers the entire sum, including both squared terms. Z here is a magnitude: it describes the size of the combined opposition, not whether the circuit is predominantly capacitive or inductive.\n\nUse this expression for the stated series-RLC arrangement. This lesson does not provide a general parallel-network expression or a method for arbitrary mixed networks. Its examples assume that resistance and both reactances are already supplied for the same operating frequency.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-P09",
        "type": "reflection",
        "prompt": "Use the explanation under “Interpret the reactive difference before squaring” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The source’s phase descriptions explain why the reactive contributions must be distinguished rather than simply added as positive numbers. Printed p. 21 shows capacitor current leading voltage by 90°. Printed p. 22 shows inductor voltage leading current. These are different current–voltage relationships. The series example on p. 23 combines their opposing reactive contributions through a difference.\n\nFor this lesson, define a calculation quantity D = X_C − X_L, in ohms. This is an instructional label for the difference used in the source formula, not a new source symbol.\n\nIf X_C exceeds X_L, D is positive under this chosen subtraction order and the circuit is predominantly capacitive. If X_L exceeds X_C, D is negative and the circuit is predominantly inductive. If the values are equal, D is zero.\n\nThe sign depends on which subtraction order you choose. Therefore, report predominance with words and the original reactance comparison, rather than relying on an unexplained sign. The supplied inductive evidence does not specify a numerical phase angle, and this lesson does not infer a circuit phase angle.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15-P10",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Magnitude combines squared contributions”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "After calculating D = X_C − X_L, the magnitude calculation becomes Z = √(D² + R²). Squaring makes D² nonnegative, whether D was positive or negative. Thus the same resistance and the same absolute reactive difference produce the same impedance magnitude even when the predominant reactive type differs.\n\nThe p. 23 phasor sketch accompanies the source’s predominantly capacitive example. Use the sketch as a representation of the combination, not as a picture of physical current direction. The square-and-square-root expression combines the resistive contribution with the net reactive contribution; it is not ordinary addition of their magnitudes.\n\nFor example, a reactive difference of 4 Ω and resistance of 3 Ω produce √(4² + 3²) = 5 Ω, not 4 + 3 = 7 Ω. The squared terms have units Ω², and taking the square root restores Ω.\n\nA useful formula-derived check is Z ≥ R and Z ≥ |D| for nonnegative resistance. A result smaller than either contribution indicates an arithmetic or formula-entry error.",
        "safety": false,
        "source_ids": [
          "S16"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "rlc",
    "kind": "mixed",
    "ordering": "sequential",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U15",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Chapter 3: Math for Electronics",
      "order": 0,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16",
    "generated": true,
    "subtrack": "generated",
    "title": "Resonance and Resonant Frequency",
    "description": "Explain resonance and calculate resonant frequency from the verified series example in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 23–24. Newly authored paper exercises emphasize unit conversion, square-root order and checks without extending the source’s claims to parallel resonance.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22, 23, 24",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Resonance: equal reactances at one frequency",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "From reactance equality to the frequency formula",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Verified example with an independent calculation",
        "source_ids": [
          "S17"
        ]
      },
      {
        "heading": "Check resonance by calculating both reactances",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Fresh worked example and scaling checks",
        "source_ids": [
          "S17"
        ]
      }
    ],
    "objectives": [
      "Explain resonance as equality of inductive and capacitive reactance.",
      "Connect the component reactance formulas to the resonant-frequency formula.",
      "Calculate resonant frequency with inductance in henrys and capacitance in farads.",
      "Reproduce and independently check the source’s 200 µH and 200 pF example.",
      "Explain how changes in inductance or capacitance affect resonant frequency."
    ],
    "html": "<p>Explain resonance and calculate resonant frequency from the verified series example in Chapter 3, “Math for Electronics,” by Fitz Herbert Reid, CET, printed pp. 23–24. Newly authored paper exercises emphasize unit conversion, square-root order and checks without extending the source’s claims to parallel resonance.</p><h3>Resonance: equal reactances at one frequency</h3><p>The “Resonance” material on printed p. 23 identifies resonance through equality of inductive and capacitive reactance: X_L = X_C. Here X_L is inductive reactance and X_C is capacitive reactance, both measured in ohms (Ω). The source’s numerical example is explicitly a series circuit; this lesson retains that context.</p><p></p><p>The equality concerns the two reactance magnitudes at the same frequency. It does not say that inductance and capacitance are equal: those are different quantities, measured in henrys and farads. Nor does it say that voltage and current are equal numerical quantities.</p><p></p><p>The component formulas explain why the equality can occur. With component values fixed, X_L = 2πfL increases as frequency increases, while X_C = 1/(2πfC) decreases. Resonant frequency, written f_r, is the frequency at which these magnitudes match.</p><p></p><p>The extraction flags a source current claim that does not clearly distinguish series from parallel conditions. This lesson therefore teaches the verified equality and frequency calculation, not a general maximum-current claim or a parallel-resonance rule.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>From reactance equality to the frequency formula</h3><p>Define L as inductance in henrys (H), C as capacitance in farads (F), and f_r as resonant frequency in hertz (Hz). The constant π is dimensionless and approximately 3.14159. Assume positive L and C values.</p><p></p><p>Substitute the component formulas into the resonance condition:</p><p>2πf_rL = 1/(2πf_rC).</p><p></p><p>Multiply both sides by 2πf_rC to remove the denominator:</p><p>(2πf_r)²LC = 1.</p><p></p><p>Divide by 4π²LC:</p><p>f_r² = 1/(4π²LC).</p><p></p><p>Taking the positive square root gives the verified formula:</p><p>f_r = 1/(2π√(LC)).</p><p></p><p>The positive root is chosen because the frequency here is positive. The radical covers the product LC only; 2π multiplies that square root outside it. Evaluate LC first, then its square root, then the full denominator, and finally its reciprocal.</p><p></p><p>This algebra connects the source’s accepted equations. It does not introduce a new circuit model. C inside the formula is capacitance, not the coulomb unit, and f_r is a frequency rather than a farad abbreviation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Verified example with an independent calculation</h3><p>The source’s series example on printed p. 23, with its solution continuing on p. 24, uses L = 200 µH and C = 200 pF and reports approximately 795 kHz. Convert the values before substituting:</p><p></p><p>L = 200 × 10^-6 H = 2 × 10^-4 H.</p><p>C = 200 × 10^-12 F = 2 × 10^-10 F.</p><p></p><p>Multiply:</p><p>LC = (2 × 10^-4)(2 × 10^-10) H·F = 4 × 10^-14 H·F.</p><p></p><p>Take the square root of the entire product:</p><p>√(LC) = 2 × 10^-7 s.</p><p></p><p>Now evaluate the denominator and reciprocal:</p><p>2π√(LC) ≈ 1.256637 × 10^-6 s.</p><p>f_r ≈ 1/(1.256637 × 10^-6 s) ≈ 795775 Hz.</p><p></p><p>Thus the independently recalculated result is approximately 795.8 kHz, or 796 kHz to the nearest kilohertz. The source reports approximately 795 kHz; retain that as its reported result rather than claiming it is nearest-kilohertz rounding of this calculation.</p><p></p><p>The unit check matters: H·F has the dimensions of seconds squared, so √(LC) has dimensions of seconds. Taking the reciprocal of the denominator therefore returns hertz.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.)</p><h3>Check resonance by calculating both reactances</h3><p>A useful independent check is to substitute the calculated resonant frequency into both reactance formulas. Using the unrounded result from the source-value calculation, f_r ≈ 795774.7 Hz:</p><p></p><p>X_L = 2πf_rL</p><p>≈ 2π × 795774.7 × (2 × 10^-4) Ω</p><p>≈ 1000 Ω.</p><p></p><p>X_C = 1/(2πf_rC)</p><p>≈ 1/[2π × 795774.7 × (2 × 10^-10)] Ω</p><p>≈ 1000 Ω.</p><p></p><p>The matching values confirm the defining equality. Small differences can appear if a rounded frequency is used; keep intermediate digits when checking.</p><p></p><p>This check is a newly authored application of the verified component formulas, not an additional transcribed source solution. It checks the resonance calculation without claiming a circuit current, voltage amplitude or phase angle.</p><p></p><p>If the two reactances differ substantially, inspect the prefix conversions and calculator parentheses. In particular, 200 µH is not 200 H, and 200 pF is not 200 F. Both formulas must use the same frequency in hertz.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Fresh worked example and scaling checks</h3><p>The formula f_r = 1/(2π√(LC)) provides a direction check. Increasing either L or C while holding the other fixed increases the denominator and lowers resonant frequency. The square root makes the relationship different from simple inverse proportionality.</p><p></p><p>Newly authored comparison: if inductance becomes four times as large while capacitance stays fixed, LC becomes four times as large, √(LC) doubles, and f_r halves. If both inductance and capacitance double, their product becomes four times as large, so resonant frequency again halves.</p><p></p><p>Newly authored worked example: let L = 1 mH = 10^-3 H and C = 1 nF = 10^-9 F. Then LC = 10^-12 H·F and √(LC) = 10^-6 s. Therefore f_r = 1/(2π × 10^-6 s) ≈ 159155 Hz ≈ 159.2 kHz.</p><p></p><p>For any calculation, record the arrangement and assumptions, convert to henrys and farads, multiply, take the square root, form the denominator and take its reciprocal. Check the units and the expected direction of change. These are paper calculations, not construction or testing instructions.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Prediction 1",
        "prompt": "What equality defines resonance in this lesson? Does it mean that inductance and capacitance have equal values?",
        "answer": "X_L = X_C at the same frequency. No: L is measured in henrys and C in farads; resonance equates their reactances in ohms.",
        "explanation": "The source sets the reactance magnitudes equal at resonant frequency. Inductance and capacitance have different units and are not the quantities being equated.",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "title": "Prediction 2",
        "prompt": "Practice using the verified source values: For 200 µH and 200 pF, calculate LC, its square root and the resonant frequency. Distinguish your recalculated result from the source’s reported approximation.",
        "answer": "LC = 4 × 10^-14 H·F; √(LC) = 2 × 10^-7 s; f_r ≈ 795.8 kHz. The source reports approximately 795 kHz.",
        "explanation": "Convert to 2 × 10^-4 H and 2 × 10^-10 F. Their product is 4 × 10^-14 H·F, whose square root is 2 × 10^-7 s. Taking 1/(2π times that square root) gives approximately 795775 Hz.",
        "source_ids": [
          "S17"
        ]
      },
      {
        "title": "Prediction 3",
        "prompt": "Calculate resonant frequency for L = 10 mH and C = 10 nF. Show the conversions and the square-root step.",
        "answer": "f_r ≈ 15.92 kHz.",
        "explanation": "L = 10^-2 H and C = 10^-8 F. Thus LC = 10^-10 H·F, √(LC) = 10^-5 s, and f_r = 1/(2π × 10^-5 s) ≈ 15915.5 Hz.",
        "source_ids": [
          "S17"
        ]
      },
      {
        "title": "Prediction 4",
        "prompt": "A series example has resonant frequency 80 kHz. Capacitance becomes four times larger while inductance stays fixed. What is the new resonant frequency?",
        "answer": "40 kHz.",
        "explanation": "The product LC becomes four times larger, making its square root twice as large. The reciprocal formula therefore gives half the original frequency.",
        "source_ids": [
          "S17"
        ]
      }
    ],
    "questions": [
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q01",
        "type": "reflection",
        "prompt": "What equality defines resonance in this lesson? Does it mean that inductance and capacitance have equal values?",
        "explain": "The source sets the reactance magnitudes equal at resonant frequency. Inductance and capacitance have different units and are not the quantities being equated.",
        "rubric": "Expected answer: X_L = X_C at the same frequency. No: L is measured in henrys and C in farads; resonance equates their reactances in ohms.\nReasoning: The source sets the reactance magnitudes equal at resonant frequency. Inductance and capacitance have different units and are not the quantities being equated.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q02",
        "type": "reflection",
        "prompt": "Practice using the verified source values: For 200 µH and 200 pF, calculate LC, its square root and the resonant frequency. Distinguish your recalculated result from the source’s reported approximation.",
        "explain": "Convert to 2 × 10^-4 H and 2 × 10^-10 F. Their product is 4 × 10^-14 H·F, whose square root is 2 × 10^-7 s. Taking 1/(2π times that square root) gives approximately 795775 Hz.",
        "rubric": "Expected answer: LC = 4 × 10^-14 H·F; √(LC) = 2 × 10^-7 s; f_r ≈ 795.8 kHz. The source reports approximately 795 kHz.\nReasoning: Convert to 2 × 10^-4 H and 2 × 10^-10 F. Their product is 4 × 10^-14 H·F, whose square root is 2 × 10^-7 s. Taking 1/(2π times that square root) gives approximately 795775 Hz.",
        "safety": false,
        "source_ids": [
          "S17"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q03",
        "type": "reflection",
        "prompt": "Calculate resonant frequency for L = 10 mH and C = 10 nF. Show the conversions and the square-root step.",
        "explain": "L = 10^-2 H and C = 10^-8 F. Thus LC = 10^-10 H·F, √(LC) = 10^-5 s, and f_r = 1/(2π × 10^-5 s) ≈ 15915.5 Hz.",
        "rubric": "Expected answer: f_r ≈ 15.92 kHz.\nReasoning: L = 10^-2 H and C = 10^-8 F. Thus LC = 10^-10 H·F, √(LC) = 10^-5 s, and f_r = 1/(2π × 10^-5 s) ≈ 15915.5 Hz.",
        "safety": false,
        "source_ids": [
          "S17"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q04",
        "type": "reflection",
        "prompt": "A series example has resonant frequency 80 kHz. Capacitance becomes four times larger while inductance stays fixed. What is the new resonant frequency?",
        "explain": "The product LC becomes four times larger, making its square root twice as large. The reciprocal formula therefore gives half the original frequency.",
        "rubric": "Expected answer: 40 kHz.\nReasoning: The product LC becomes four times larger, making its square root twice as large. The reciprocal formula therefore gives half the original frequency.",
        "safety": false,
        "source_ids": [
          "S17"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q05",
        "type": "reflection",
        "prompt": "A learner replaces √(LC) with LC in the denominator of the resonant-frequency formula. Identify the error and explain the unit check that exposes it.",
        "explain": "The accepted formula requires the square root of the product. LC has dimensions of seconds squared, whereas √(LC) has dimensions of seconds. The reciprocal of a time gives frequency; the reciprocal of time squared does not.",
        "rubric": "Expected answer: The square-root operation was omitted. Use f_r = 1/(2π√(LC)); its denominator must have dimensions of time.\nReasoning: The accepted formula requires the square root of the product. LC has dimensions of seconds squared, whereas √(LC) has dimensions of seconds. The reciprocal of a time gives frequency; the reciprocal of time squared does not.",
        "safety": false,
        "source_ids": [
          "S17"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-Q06",
        "type": "reflection",
        "prompt": "At a candidate resonant frequency, the calculated values are X_L = 900 Ω and X_C = 1100 Ω. Has the resonance condition been met? With L and C fixed, which direction of frequency change moves the two values toward equality?",
        "explain": "The values are unequal. Increasing frequency raises X_L and lowers X_C, moving these particular values toward each other. This is a direction check, not a calculation of the required frequency.",
        "rubric": "Expected answer: No. Increasing frequency moves these values toward equality.\nReasoning: The values are unequal. Increasing frequency raises X_L and lowers X_C, moving these particular values toward each other. This is a direction check, not a calculation of the required frequency.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-P07",
        "type": "reflection",
        "prompt": "Explain the main idea from “Resonance: equal reactances at one frequency” in your own words.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The “Resonance” material on printed p. 23 identifies resonance through equality of inductive and capacitive reactance: X_L = X_C. Here X_L is inductive reactance and X_C is capacitive reactance, both measured in ohms (Ω). The source’s numerical example is explicitly a series circuit; this lesson retains that context.\n\nThe equality concerns the two reactance magnitudes at the same frequency. It does not say that inductance and capacitance are equal: those are different quantities, measured in henrys and farads. Nor does it say that voltage and current are equal numerical quantities.\n\nThe component formulas explain why the equality can occur. With component values fixed, X_L = 2πfL increases as frequency increases, while X_C = 1/(2πfC) decreases. Resonant frequency, written f_r, is the frequency at which these magnitudes match.\n\nThe extraction flags a source current claim that does not clearly distinguish series from parallel conditions. This lesson therefore teaches the verified equality and frequency calculation, not a general maximum-current claim or a parallel-resonance rule.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-P08",
        "type": "reflection",
        "prompt": "Use the explanation under “From reactance equality to the frequency formula” to walk through its reasoning.",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "Define L as inductance in henrys (H), C as capacitance in farads (F), and f_r as resonant frequency in hertz (Hz). The constant π is dimensionless and approximately 3.14159. Assume positive L and C values.\n\nSubstitute the component formulas into the resonance condition:\n2πf_rL = 1/(2πf_rC).\n\nMultiply both sides by 2πf_rC to remove the denominator:\n(2πf_r)²LC = 1.\n\nDivide by 4π²LC:\nf_r² = 1/(4π²LC).\n\nTaking the positive square root gives the verified formula:\nf_r = 1/(2π√(LC)).\n\nThe positive root is chosen because the frequency here is positive. The radical covers the product LC only; 2π multiplies that square root outside it. Evaluate LC first, then its square root, then the full denominator, and finally its reciprocal.\n\nThis algebra connects the source’s accepted equations. It does not introduce a new circuit model. C inside the formula is capacitance, not the coulomb unit, and f_r is a frequency rather than a farad abbreviation.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-P09",
        "type": "reflection",
        "prompt": "What assumptions, quantities or definitions matter under “Verified example with an independent calculation”?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "The source’s series example on printed p. 23, with its solution continuing on p. 24, uses L = 200 µH and C = 200 pF and reports approximately 795 kHz. Convert the values before substituting:\n\nL = 200 × 10^-6 H = 2 × 10^-4 H.\nC = 200 × 10^-12 F = 2 × 10^-10 F.\n\nMultiply:\nLC = (2 × 10^-4)(2 × 10^-10) H·F = 4 × 10^-14 H·F.\n\nTake the square root of the entire product:\n√(LC) = 2 × 10^-7 s.\n\nNow evaluate the denominator and reciprocal:\n2π√(LC) ≈ 1.256637 × 10^-6 s.\nf_r ≈ 1/(1.256637 × 10^-6 s) ≈ 795775 Hz.\n\nThus the independently recalculated result is approximately 795.8 kHz, or 796 kHz to the nearest kilohertz. The source reports approximately 795 kHz; retain that as its reported result rather than claiming it is nearest-kilohertz rounding of this calculation.\n\nThe unit check matters: H·F has the dimensions of seconds squared, so √(LC) has dimensions of seconds. Taking the reciprocal of the denominator therefore returns hertz.",
        "safety": false,
        "source_ids": [
          "S17"
        ]
      },
      {
        "id": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16-P10",
        "type": "reflection",
        "prompt": "How would you check that you understood “Check resonance by calculating both reactances” correctly?",
        "explain": "Compare your explanation with the saved source-backed material.",
        "rubric": "A useful independent check is to substitute the calculated resonant frequency into both reactance formulas. Using the unrounded result from the source-value calculation, f_r ≈ 795774.7 Hz:\n\nX_L = 2πf_rL\n≈ 2π × 795774.7 × (2 × 10^-4) Ω\n≈ 1000 Ω.\n\nX_C = 1/(2πf_rC)\n≈ 1/[2π × 795774.7 × (2 × 10^-10)] Ω\n≈ 1000 Ω.\n\nThe matching values confirm the defining equality. Small differences can appear if a rounded frequency is used; keep intermediate digits when checking.\n\nThis check is a newly authored application of the verified component formulas, not an additional transcribed source solution. It checks the resonance calculation without claiming a circuit current, voltage amplitude or phase angle.\n\nIf the two reactances differ substantially, inspect the prefix conversions and calculator parentheses. In particular, 200 µH is not 200 H, and 200 pF is not 200 F. Both formulas must use the same frequency in hertz.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      }
    ],
    "minutes": 40,
    "simulator": "resonance",
    "kind": "mixed",
    "ordering": "sequential",
    "sourceUnitId": "GEN-75F4C1DB-1D8C-40DF-890B-4211862BCFC4-U16",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": true,
    "curatedSeries": false,
    "seriesId": null,
    "seriesOrder": null,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "legacy"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 1,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U01",
    "generated": true,
    "subtrack": "generated",
    "title": "01 · Read the scale before calculating",
    "description": "Use powers of ten and prefixes to keep the same electrical quantity while changing its written scale.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "A prefix changes the label, not the quantity",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "heading": "Why scientific notation helps",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "heading": "A worked conversion: pF to µF",
        "source_ids": [
          "S1",
          "S2"
        ]
      },
      {
        "heading": "Check direction and capitalization",
        "source_ids": [
          "S1",
          "S2"
        ]
      }
    ],
    "objectives": [
      "Explain what a positive or negative exponent does",
      "Convert between prefixes using their factors",
      "Check whether a converted value is sensible"
    ],
    "html": "<p>Use powers of ten and prefixes to keep the same electrical quantity while changing its written scale.</p><h3>A prefix changes the label, not the quantity</h3><p>Think of 1,000 milliamperes and 1 ampere as two labels for the same current. The prefix tells you the scale used by the number beside it. Kilo means 10³, milli means 10⁻³, micro means 10⁻⁶, and pico means 10⁻¹².</p><p></p><p>Before entering a value into a formula, read the complete label. A value of 5 mA is not the same as 5 A. Convert the number and its unit together: 5 mA = 5 × 10⁻³ A = 0.005 A. The current has not become smaller; you have expressed it in a larger unit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Why scientific notation helps</h3><p>Scientific notation separates a manageable leading number from a scale factor. In 1.25 × 10⁵, the 10⁵ multiplies 1.25 by 100,000, giving 125,000. A negative exponent means a reciprocal: 10⁻³ = 1/1,000. So 7 × 10⁻³ is 0.007.</p><p></p><p>Keep the leading number between 1 and 10 when writing normalized scientific notation. If you move the decimal in the leading number, compensate with the exponent so the original value stays unchanged. This is a way to organize place value, not permission to drop zeros arbitrarily.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>A worked conversion: pF to µF</h3><p>The source example starts with 1,000 pF. Convert to farads first: 1,000 × 10⁻¹² F = 10⁻⁹ F. One microfarad is 10⁻⁶ F, so the number of microfarads is 10⁻⁹ / 10⁻⁶ = 10⁻³. The result is 0.001 µF.</p><p></p><p>An equivalent shortcut divides the picofarad number by one million. That million comes from the six powers of ten between pico and micro. In the slider, compare several pF values and watch both µF and F update. Explain the factor before trusting a decimal shift.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Check direction and capitalization</h3><p>Moving from a smaller unit to a larger unit produces a smaller written number. Thus 700 kHz is 700,000 Hz but only 0.7 MHz. The frequency itself remains identical. A conversion that makes all three numbers equal has ignored the prefixes.</p><p></p><p>Case matters: m is milli and M is mega. A sensible result includes its unit, and a quick conversion back should recover the original number. Use these two checks whenever an electronics answer seems a thousand or a million times too large.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Move between capacitance scales",
        "prompt": "Start at 1,000 pF, then increase the slider to 2,000 pF. Predict the µF values before moving it.",
        "answer": "0.001 µF becomes 0.002 µF",
        "explanation": "The number doubles at every equivalent scale; pF-to-µF divides by one million.",
        "source_ids": [
          "S1",
          "S2"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "prefixes"
      },
      {
        "title": "Spot the thousandfold mistake",
        "prompt": "Which pair represents one unchanged current?",
        "answer": "2 mA and 0.002 A",
        "explanation": "Changing from mA to A requires multiplying by 10⁻³, not simply removing the prefix.",
        "source_ids": [
          "S1",
          "S2"
        ],
        "kind": "choice",
        "choices": [
          "2 mA and 0.2 A",
          "2 mA and 0.002 A",
          "2 mA and 2 A",
          "2 mA and 2,000 A"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U01-Q01",
        "type": "choice",
        "prompt": "What does 10⁻³ mean?",
        "explain": "A negative exponent gives a reciprocal: 10⁻³ = 1/10³ = 0.001.",
        "rubric": "Expected answer: One thousandth\nReasoning: A negative exponent gives a reciprocal: 10⁻³ = 1/10³ = 0.001.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "One thousandth",
          "One thousand",
          "Negative three",
          "Minus one thousand"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U01-Q02",
        "type": "choice",
        "prompt": "Which is normalized scientific notation for 125,000?",
        "explain": "1.25 × 100,000 = 125,000, with the leading number between 1 and 10.",
        "rubric": "Expected answer: 1.25 × 10⁵\nReasoning: 1.25 × 100,000 = 125,000, with the leading number between 1 and 10.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "12.5 × 10⁵",
          "1.25 × 10⁻⁵",
          "125 × 10⁵",
          "1.25 × 10⁵"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U01-Q03",
        "type": "choice",
        "prompt": "Which current equals 5 mA?",
        "explain": "Milli means 10⁻³: 5 × 0.001 A = 0.005 A.",
        "rubric": "Expected answer: 0.005 A\nReasoning: Milli means 10⁻³: 5 × 0.001 A = 0.005 A.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "0.5 A",
          "5 A",
          "0.005 A",
          "5,000 A"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U01-Q04",
        "type": "choice",
        "prompt": "Which frequency equals 700 kHz?",
        "explain": "1 MHz is 1,000 kHz, so divide 700 by 1,000.",
        "rubric": "Expected answer: 0.7 MHz\nReasoning: 1 MHz is 1,000 kHz, so divide 700 by 1,000.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "0.0007 MHz",
          "0.7 MHz",
          "700 MHz",
          "7 MHz"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U01-Q05",
        "type": "choice",
        "prompt": "Convert 1,000 pF to µF.",
        "explain": "Pico-to-micro is a millionfold scale change; divide 1,000 by 1,000,000.",
        "rubric": "Expected answer: 0.001 µF\nReasoning: Pico-to-micro is a millionfold scale change; divide 1,000 by 1,000,000.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "0.001 µF",
          "1 µF",
          "1,000 µF",
          "0.000001 µF"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U01-Q06",
        "type": "choice",
        "prompt": "Someone replaces 3 mA with 3 A in a formula. What happened?",
        "explain": "Removing milli without adjusting the number multiplies the represented current by 1,000.",
        "rubric": "Expected answer: The represented current became 1,000 times too large\nReasoning: Removing milli without adjusting the number multiplies the represented current by 1,000.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "The value stayed equivalent",
          "The current became 1,000 times smaller",
          "Only the spelling changed",
          "The represented current became 1,000 times too large"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U01-Q07",
        "type": "number",
        "prompt": "Express 2.4 kHz in hertz. Enter the number in Hz.",
        "explain": "Kilo means 1,000; 2.4 × 1,000 = 2,400 Hz.",
        "rubric": "Expected answer: 2400 Hz\nReasoning: Kilo means 1,000; 2.4 × 1,000 = 2,400 Hz.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "answer": 2400,
        "unit": "Hz",
        "tolerance": 24
      },
      {
        "id": "C3-CURATED-U01-Q08",
        "type": "choice",
        "prompt": "Which statement about m and M is correct?",
        "explain": "Prefix capitalization changes the factor, so it is part of the measurement.",
        "rubric": "Expected answer: m is milli; M is mega\nReasoning: Prefix capitalization changes the factor, so it is part of the measurement.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "Both mean mega",
          "m is micro; M is milli",
          "m is milli; M is mega",
          "Both mean milli"
        ],
        "correct": 2
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U01",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 1,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "A negative exponent gives a reciprocal: 10⁻³ = 1/10³ = 0.001.",
      "anchors": [
        [
          "Goal 1",
          "Explain what a positive or negative exponent does"
        ],
        [
          "Goal 2",
          "Convert between prefixes using their factors"
        ],
        [
          "Goal 3",
          "Check whether a converted value is sensible"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "What does 10⁻³ mean?",
      "outcome": "Use powers of ten and prefixes to keep the same electrical quantity while changing its written scale.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 2,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U02",
    "generated": true,
    "subtrack": "generated",
    "title": "02 · Rearrange equations without guessing",
    "description": "Use inverse operations on both sides of an equality, then check the result by substitution.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Equality is a relationship to preserve",
        "source_ids": [
          "S3",
          "S4"
        ]
      },
      {
        "heading": "Solve one small problem completely",
        "source_ids": [
          "S3",
          "S4"
        ]
      },
      {
        "heading": "Turn a product into a quotient",
        "source_ids": [
          "S3",
          "S4"
        ]
      },
      {
        "heading": "Numbers, units and a final check",
        "source_ids": [
          "S3",
          "S4"
        ]
      }
    ],
    "objectives": [
      "Interpret equality as a balance",
      "Isolate a variable using an inverse operation",
      "Test the result in the original equation"
    ],
    "html": "<p>Use inverse operations on both sides of an equality, then check the result by substitution.</p><h3>Equality is a relationship to preserve</h3><p>The equals sign says the expression on the left has the same value as the expression on the right. A letter is a name for a quantity; it can stand for a known number or an unknown you need to find. In 4y = 2, the term 4y means four times y.</p><p></p><p>You cannot remove the 4 from one side and leave the other side untouched. Whatever operation you choose must preserve the relationship. Divide both sides by the same nonzero number to undo multiplication, or multiply both sides to undo a division.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Solve one small problem completely</h3><p>Start with 4y = 2. Divide both sides by 4: (4y)/4 = 2/4. The left simplifies to y because 4/4 = 1. The right is 0.5, so y = 0.5. Check in the original equation: 4 × 0.5 = 2.</p><p></p><p>That check matters. An answer of y = 8 might look like a simple multiplication, but 4 × 8 = 32 does not reproduce the original right side. The substitution test diagnoses the mistake without needing to remember an algebra shortcut.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Turn a product into a quotient</h3><p>In a = bc, suppose you need b. Because b is multiplied by c, divide both sides by c: a/c = bc/c = b, assuming c is nonzero. So b = a/c. If you need c instead, divide both sides by b to get c = a/b.</p><p></p><p>This same reasoning makes Ohm’s law useful. From V = IR, divide by R to get I = V/R, or divide by I to get R = V/I. The unknown tells you which form is convenient; the underlying relationship does not change.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Numbers, units and a final check</h3><p>For a hypothetical V = 12 V and R = 3 kΩ, first write R = 3,000 Ω. Then I = 12/3,000 = 0.004 A. Check by multiplying: 0.004 A × 3,000 Ω = 12 V.</p><p></p><p>Use the algebra slider to change the coefficient and right-hand side. A larger coefficient with the same right side makes the unknown smaller. That directional prediction is another error check. Do not divide by zero; it changes the mathematical conditions under which the rearrangement is valid.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Balance the equation",
        "prompt": "Set the coefficient to 4 and the right side to 2. Then keep the right side fixed and set the coefficient to 8.",
        "answer": "The unknown changes from 0.5 to 0.25",
        "explanation": "The unknown equals the right-hand side divided by the coefficient.",
        "source_ids": [
          "S3",
          "S4"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "algebra"
      },
      {
        "title": "Select the inverse operation",
        "prompt": "In V = IR, you want I and know a nonzero R. What should you do?",
        "answer": "Divide both sides by R",
        "explanation": "Dividing by R leaves I alone and gives I = V/R.",
        "source_ids": [
          "S3",
          "S4"
        ],
        "kind": "choice",
        "choices": [
          "Divide both sides by R",
          "Multiply both sides by R",
          "Subtract R from V",
          "Divide only the right side by I"
        ],
        "correct": 0,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U02-Q01",
        "type": "choice",
        "prompt": "In 4y = 2, what does 4y mean?",
        "explain": "A coefficient next to a variable denotes multiplication.",
        "rubric": "Expected answer: 4 multiplied by y\nReasoning: A coefficient next to a variable denotes multiplication.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "4 multiplied by y",
          "4 plus y",
          "4 divided by y",
          "The digits 4 and y joined together"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U02-Q02",
        "type": "choice",
        "prompt": "What operation isolates y in 4y = 2?",
        "explain": "Dividing by the nonzero coefficient undoes multiplication by 4.",
        "rubric": "Expected answer: Divide both sides by 4\nReasoning: Dividing by the nonzero coefficient undoes multiplication by 4.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "Multiply only the right side by 4",
          "Subtract y from both sides",
          "Divide both sides by y",
          "Divide both sides by 4"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U02-Q03",
        "type": "choice",
        "prompt": "What is y in 4y = 2?",
        "explain": "y = 2/4 = 0.5, and 4 × 0.5 returns 2.",
        "rubric": "Expected answer: 0.5\nReasoning: y = 2/4 = 0.5, and 4 × 0.5 returns 2.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "2",
          "4",
          "0.5",
          "8"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U02-Q04",
        "type": "choice",
        "prompt": "From a = bc, how do you isolate b when c is nonzero?",
        "explain": "Divide both sides by c to remove c from the product.",
        "rubric": "Expected answer: b = a/c\nReasoning: Divide both sides by c to remove c from the product.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "b = a − c",
          "b = a/c",
          "b = ac",
          "b = c/a"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U02-Q05",
        "type": "choice",
        "prompt": "Which check tests an answer to 4y = 2 directly?",
        "explain": "The original equality is the test the solution must satisfy.",
        "rubric": "Expected answer: Substitute it into 4y and see whether the result is 2\nReasoning: The original equality is the test the solution must satisfy.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "Substitute it into 4y and see whether the result is 2",
          "Check whether y is an integer",
          "Multiply it by 2",
          "Check whether it is positive only"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U02-Q06",
        "type": "choice",
        "prompt": "If 6x = 18, which value works?",
        "explain": "Divide by 6, then check 6 × 3 = 18.",
        "rubric": "Expected answer: 3\nReasoning: Divide by 6, then check 6 × 3 = 18.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "108",
          "12",
          "1/3",
          "3"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U02-Q07",
        "type": "choice",
        "prompt": "With a fixed right side, doubling the coefficient in by = a makes y…",
        "explain": "y = a/b, so doubling the denominator halves the quotient.",
        "rubric": "Expected answer: Half as large\nReasoning: y = a/b, so doubling the denominator halves the quotient.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "Unchanged",
          "Automatically negative",
          "Half as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U02-Q08",
        "type": "number",
        "prompt": "Solve 5x = 20. Enter x.",
        "explain": "x = 20/5 = 4; substitution gives 5 × 4 = 20.",
        "rubric": "Expected answer: 4\nReasoning: x = 20/5 = 4; substitution gives 5 × 4 = 20.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "answer": 4,
        "unit": "",
        "tolerance": 0.04
      },
      {
        "id": "C3-CURATED-U02-Q09",
        "type": "choice",
        "prompt": "Which condition matters when dividing both sides by c?",
        "explain": "Division by zero is undefined; the quotient rearrangement requires a nonzero divisor.",
        "rubric": "Expected answer: c must not be zero\nReasoning: Division by zero is undefined; the quotient rearrangement requires a nonzero divisor.",
        "safety": false,
        "source_ids": [
          "S3",
          "S4"
        ],
        "choices": [
          "c must be negative",
          "c must not be zero",
          "c must equal one",
          "c must be an integer"
        ],
        "correct": 1
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U02",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 2,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "A coefficient next to a variable denotes multiplication.",
      "anchors": [
        [
          "Goal 1",
          "Interpret equality as a balance"
        ],
        [
          "Goal 2",
          "Isolate a variable using an inverse operation"
        ],
        [
          "Goal 3",
          "Test the result in the original equation"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "In 4y = 2, what does 4y mean?",
      "outcome": "Use inverse operations on both sides of an equality, then check the result by substitution.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 3,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U03",
    "generated": true,
    "subtrack": "generated",
    "title": "03 · Tell a symbol from a unit",
    "description": "Read formulas as relationships between quantities, using the symbol and unit tables as a reference rather than a memory test.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19, 20, 24",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "A letter and a unit do different jobs",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ]
      },
      {
        "heading": "The same character can have different meanings",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ]
      },
      {
        "heading": "Greek letters are readable labels",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ]
      },
      {
        "heading": "Use units as a reasonableness test",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ]
      }
    ],
    "objectives": [
      "Separate a variable name from its measurement unit",
      "Recognize common electronic and Greek notation",
      "Resolve a symbol’s meaning from context"
    ],
    "html": "<p>Read formulas as relationships between quantities, using the symbol and unit tables as a reference rather than a memory test.</p><h3>A letter and a unit do different jobs</h3><p>In I = V/R, I names current, while amperes are the unit used to express its value. R names resistance, while Ω is its unit symbol. The source table similarly places resistance, reactance and impedance in ohms. These are different quantities even though they share a unit.</p><p></p><p>Before calculating, say what each symbol means and what unit the numerical value uses. A line such as R = 2 kΩ is a useful complete statement: it identifies the quantity, its value and its scale.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>The same character can have different meanings</h3><p>Context decides meaning. C in Q = CV means capacitance, measured in farads. C after a charge value is the abbreviation for coulomb. For example, Q = 60 µC gives a charge, not a capacitance. Likewise, F can be the farad unit while some source notation uses capital F for frequency.</p><p></p><p>Avoid guessing from the shape of a letter. Read the local definition and the surrounding units. We use f for frequency and E for energy where defined, and keep V for voltage in the capacitor energy equation so the roles stay distinct.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Greek letters are readable labels</h3><p>The chapter includes a Greek-letter reference table. μ is mu and appears in the micro-prefix. Ω is uppercase omega and is used for the ohm unit. π is pi and appears in reactance and resonance formulas. You can look these up; recognizing them is more valuable here than reciting the entire alphabet.</p><p></p><p>A symbol in a formula is not automatically a measurement unit. In X_C = 1/(2πfC), π is a dimensionless numerical constant, f is frequency and C is capacitance. The result X_C has the unit ohm.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Use units as a reasonableness test</h3><p>A capacitor charge calculation should end in coulombs; an energy calculation should end in joules; a frequency calculation should end in hertz. If you report 60 µF for a question asking for stored charge, the unit alone reveals a category mistake.</p><p></p><p>The table also names siemens for conductance, admittance and susceptance. Recognize that unit association, but do not infer formulas for those quantities from this chapter’s table alone. A reference table is a vocabulary aid, not proof that an unseen topic has been taught.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Sort the quantity",
        "prompt": "A result labeled 25 µJ represents what?",
        "answer": "Energy",
        "explanation": "J is joule. The micro-prefix changes the scale but not the kind of quantity.",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "kind": "choice",
        "choices": [
          "Charge",
          "Capacitance",
          "Frequency",
          "Energy"
        ],
        "correct": 3,
        "simulator": "none"
      },
      {
        "title": "Decode the formula",
        "prompt": "In X_C = 1/(2πfC), which entry is a dimensionless constant?",
        "answer": "π",
        "explanation": "Pi is a number; the other entries represent frequency, capacitance and reactance.",
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "kind": "choice",
        "choices": [
          "C",
          "X_C",
          "π",
          "f"
        ],
        "correct": 2,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U03-Q01",
        "type": "choice",
        "prompt": "In R = 2 kΩ, what does R name?",
        "explain": "R is the variable naming the quantity; kΩ describes the unit scale.",
        "rubric": "Expected answer: Resistance\nReasoning: R is the variable naming the quantity; kΩ describes the unit scale.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "The kilo-prefix",
          "The ohm unit itself",
          "Resonant frequency",
          "Resistance"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U03-Q02",
        "type": "choice",
        "prompt": "Which quantities use ohms in the chapter’s units table?",
        "explain": "A shared unit does not make these three quantities interchangeable.",
        "rubric": "Expected answer: Resistance, reactance and impedance\nReasoning: A shared unit does not make these three quantities interchangeable.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Capacitance and frequency",
          "Power and current",
          "Resistance, reactance and impedance",
          "Charge, energy and time"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U03-Q03",
        "type": "choice",
        "prompt": "In Q = CV, what does C mean?",
        "explain": "Here C names capacitance, while Q is charge and V is voltage.",
        "rubric": "Expected answer: Capacitance\nReasoning: Here C names capacitance, while Q is charge and V is voltage.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "A fixed conversion factor",
          "Capacitance",
          "Coulomb as a numerical constant",
          "Current"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U03-Q04",
        "type": "choice",
        "prompt": "In Q = 60 µC, what does the final C mean?",
        "explain": "C is the unit abbreviation in this value, not the variable from Q = CV.",
        "rubric": "Expected answer: Coulomb\nReasoning: C is the unit abbreviation in this value, not the variable from Q = CV.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Coulomb",
          "Capacitance",
          "Current",
          "Centimeter"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U03-Q05",
        "type": "choice",
        "prompt": "What is μ in an electronic prefix called?",
        "explain": "The lower-case Greek letter mu is used for micro, or 10⁻⁶.",
        "rubric": "Expected answer: Mu\nReasoning: The lower-case Greek letter mu is used for micro, or 10⁻⁶.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Omega",
          "Pi",
          "Lambda",
          "Mu"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U03-Q06",
        "type": "choice",
        "prompt": "Which unit belongs to energy?",
        "explain": "Energy is expressed in joules; stored capacitor charge uses coulombs.",
        "rubric": "Expected answer: Joule\nReasoning: Energy is expressed in joules; stored capacitor charge uses coulombs.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Hertz",
          "Ohm",
          "Joule",
          "Farad"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U03-Q07",
        "type": "choice",
        "prompt": "Which unit does the chapter associate with conductance?",
        "explain": "The table identifies siemens; it does not supply a full conductance lesson by itself.",
        "rubric": "Expected answer: Siemens\nReasoning: The table identifies siemens; it does not supply a full conductance lesson by itself.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Watt",
          "Siemens",
          "Volt",
          "Farad"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U03-Q08",
        "type": "choice",
        "prompt": "How should you interpret an unfamiliar symbol in a formula?",
        "explain": "Local definitions and units establish meaning; letters can be reused in different contexts.",
        "rubric": "Expected answer: Read its local definition and check the units\nReasoning: Local definitions and units establish meaning; letters can be reused in different contexts.",
        "safety": false,
        "source_ids": [
          "S18",
          "S8",
          "S10"
        ],
        "choices": [
          "Read its local definition and check the units",
          "Assume it means the same thing in every formula",
          "Treat every capital letter as a unit",
          "Ignore it if a calculator accepts the number"
        ],
        "correct": 0
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U03",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 3,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "R is the variable naming the quantity; kΩ describes the unit scale.",
      "anchors": [
        [
          "Goal 1",
          "Separate a variable name from its measurement unit"
        ],
        [
          "Goal 2",
          "Recognize common electronic and Greek notation"
        ],
        [
          "Goal 3",
          "Resolve a symbol’s meaning from context"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "In R = 2 kΩ, what does R name?",
      "outcome": "Read formulas as relationships between quantities, using the symbol and unit tables as a reference rather than a memory test.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 4,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U04",
    "generated": true,
    "subtrack": "generated",
    "title": "04 · Choose the right circuit equation",
    "description": "Calculate voltage, current, resistance and resistive power by matching the equation to the quantities you actually know.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17, 18",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Start with the quantity you need",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "A complete current calculation",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Power describes an energy-transfer rate",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Why squares change the prediction",
        "source_ids": [
          "S4",
          "S5"
        ]
      },
      {
        "heading": "Use the accepted formulas, not a doubtful rearrangement",
        "source_ids": [
          "S4",
          "S5"
        ]
      }
    ],
    "objectives": [
      "Choose a useful form of Ohm’s law",
      "Convert values before substituting",
      "Distinguish electrical power from voltage or current"
    ],
    "html": "<p>Calculate voltage, current, resistance and resistive power by matching the equation to the quantities you actually know.</p><h3>Start with the quantity you need</h3><p>Ohm’s law is V = IR. Voltage V is measured in volts, current I in amperes and resistance R in ohms. If you know any two, choose a form that isolates the third: I = V/R or R = V/I.</p><p></p><p>Read the circuit description before selecting numbers. The voltage must be across the resistor whose resistance you use. A supply label and an unrelated resistor elsewhere on a board are not automatically a valid pair. Our examples use ideal single resistive loads, so the relationship is clear.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>A complete current calculation</h3><p>For a hypothetical 12 V across 3 kΩ, write the resistance as 3,000 Ω. Substitute I = 12/3,000 = 0.004 A. Multiply by 1,000 to express this as 4 mA. Check the result: 0.004 × 3,000 = 12 V.</p><p></p><p>Predict before calculating. Increasing voltage at fixed resistance increases current; increasing resistance at fixed voltage decreases current. A result that rises when only resistance doubles needs investigation. The Ohm’s-law slider makes these two relationships visible.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Power describes an energy-transfer rate</h3><p>Power P is measured in watts. For the resistive cases here, P = IV. With 12 V and 0.004 A, P = 0.048 W, or 48 mW. Voltage is energy per charge and current is charge per time; their product gives energy per time.</p><p></p><p>The chapter also gives P = I²R and P = V²/R. Choose the version that uses the values already known. With the same 12 V and 3,000 Ω, P = 12²/3,000 = 144/3,000 = 0.048 W. Agreement between two methods is a useful check.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Why squares change the prediction</h3><p>At fixed R, power varies as V². Doubling voltage doubles current but quadruples power. At fixed current, doubling R doubles I²R power; at fixed voltage, doubling R halves V²/R power. Those different conclusions come from different quantities being held constant.</p><p></p><p>Always state what stays fixed. Use the power widget to explore this before answering a scenario. Do not interpret a calculated wattage as permission to exceed an actual component’s rating; these are idealized numerical models.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p><h3>Use the accepted formulas, not a doubtful rearrangement</h3><p>The saved scan review flags ambiguous prose rearrangements on p. 18. This lesson uses the accepted V = IR, P = IV, P = I²R and P = V²/R relationships. It does not treat a poorly delimited radical in the source as a new rule.</p><p></p><p>Work in this order: name the unknown, list known quantities and units, convert prefixes, select an equation, substitute with units, calculate, then check direction and scale. The sequence is more dependable than hunting through a formula wheel without understanding what its letters mean.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Separate voltage and resistance effects",
        "prompt": "Keep resistance at 1,000 Ω. Move voltage from 5 V to 10 V, then keep voltage fixed and double resistance.",
        "answer": "Current doubles with voltage and halves with resistance",
        "explanation": "Only one changed variable lets you identify the direct or inverse relationship.",
        "source_ids": [
          "S4",
          "S5"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "ohm"
      },
      {
        "title": "See the squared effect",
        "prompt": "At 1,000 Ω, compare 5 V and 10 V. Predict the power ratio before moving the voltage control.",
        "answer": "Power rises from 25 mW to 100 mW",
        "explanation": "V²/R contains a square, so a twofold voltage change gives a fourfold power change.",
        "source_ids": [
          "S4",
          "S5"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "power"
      },
      {
        "title": "Choose what stays fixed",
        "prompt": "Which statement correctly includes the condition for a fourfold power increase?",
        "answer": "Double voltage at fixed resistance",
        "explanation": "The condition is essential; P = V²/R gives a fourfold change only when R stays fixed.",
        "source_ids": [
          "S4",
          "S5"
        ],
        "kind": "choice",
        "choices": [
          "Double resistance at fixed current",
          "Double voltage at fixed resistance",
          "Double resistance at fixed voltage",
          "Double current at fixed voltage"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U04-Q01",
        "type": "choice",
        "prompt": "You know V and R and want I. Which relation is direct?",
        "explain": "Dividing V = IR by R isolates current.",
        "rubric": "Expected answer: I = V/R\nReasoning: Dividing V = IR by R isolates current.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "I = V + R",
          "I = V/R",
          "I = VR",
          "I = R/V"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U04-Q02",
        "type": "choice",
        "prompt": "What current flows through 3 kΩ with 12 V across it?",
        "explain": "12/3,000 = 0.004 A = 4 mA.",
        "rubric": "Expected answer: 4 mA\nReasoning: 12/3,000 = 0.004 A = 4 mA.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "4 mA",
          "4 A",
          "0.004 mA",
          "36 mA"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U04-Q03",
        "type": "choice",
        "prompt": "A fixed resistor’s voltage doubles. Its current…",
        "explain": "I = V/R is directly proportional to voltage at fixed R.",
        "rubric": "Expected answer: Doubles\nReasoning: I = V/R is directly proportional to voltage at fixed R.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Halves",
          "Quadruples",
          "Stays unchanged",
          "Doubles"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U04-Q04",
        "type": "choice",
        "prompt": "At fixed voltage, doubling resistance makes current…",
        "explain": "Resistance is the denominator in I = V/R.",
        "rubric": "Expected answer: Half as large\nReasoning: Resistance is the denominator in I = V/R.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Four times as large",
          "Unchanged",
          "Half as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U04-Q05",
        "type": "choice",
        "prompt": "What unit belongs to P in P = IV?",
        "explain": "Power is an energy-transfer rate, measured in watts.",
        "rubric": "Expected answer: Watt\nReasoning: Power is an energy-transfer rate, measured in watts.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Coulomb",
          "Watt",
          "Volt",
          "Ampere"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U04-Q06",
        "type": "choice",
        "prompt": "A 5 V resistive load draws 5 mA. What power is transferred?",
        "explain": "Convert 5 mA to 0.005 A; 5 × 0.005 = 0.025 W = 25 mW.",
        "rubric": "Expected answer: 25 mW\nReasoning: Convert 5 mA to 0.005 A; 5 × 0.005 = 0.025 W = 25 mW.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "25 mW",
          "25 W",
          "1 mW",
          "0.025 mW"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U04-Q07",
        "type": "choice",
        "prompt": "You know only V and R. Which power formula uses them directly?",
        "explain": "Substitute I = V/R into P = IV to obtain V²/R.",
        "rubric": "Expected answer: P = V²/R\nReasoning: Substitute I = V/R into P = IV to obtain V²/R.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "P = IR²",
          "P = I/R",
          "P = VR",
          "P = V²/R"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U04-Q08",
        "type": "choice",
        "prompt": "At fixed resistance, doubling voltage makes resistive power…",
        "explain": "The voltage is squared in P = V²/R.",
        "rubric": "Expected answer: Four times as large\nReasoning: The voltage is squared in P = V²/R.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Half as large",
          "Unchanged",
          "Four times as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U04-Q09",
        "type": "choice",
        "prompt": "Why does entering 4 for a current of 4 mA give a wrong wattage?",
        "explain": "P = IV uses amperes with volts when the result is watts.",
        "rubric": "Expected answer: The formula then uses 4 A, a thousandfold scale error\nReasoning: P = IV uses amperes with volts when the result is watts.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Power cannot be calculated from current",
          "The formula then uses 4 A, a thousandfold scale error",
          "The formula requires milliamperes only",
          "Milliamperes are always negative"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U04-Q10",
        "type": "choice",
        "prompt": "Which result cross-checks 12 V across 3 kΩ?",
        "explain": "Current is 0.004 A, and its product with 12 V is 0.048 W.",
        "rubric": "Expected answer: 4 mA and 48 mW\nReasoning: Current is 0.004 A, and its product with 12 V is 0.048 W.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "4 mA and 48 mW",
          "4 mA and 48 W",
          "4 A and 48 mW",
          "0.4 mA and 480 mW"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U04-Q11",
        "type": "number",
        "prompt": "A 2 kΩ resistor carries 3 mA. Enter its voltage in V.",
        "explain": "V = 0.003 A × 2,000 Ω = 6 V.",
        "rubric": "Expected answer: 6 V\nReasoning: V = 0.003 A × 2,000 Ω = 6 V.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "answer": 6,
        "unit": "V",
        "tolerance": 0.06
      },
      {
        "id": "C3-CURATED-U04-Q12",
        "type": "choice",
        "prompt": "A question holds current fixed while resistance doubles. Using I²R, power…",
        "explain": "At fixed I, the squared current factor is constant and P scales directly with R.",
        "rubric": "Expected answer: Doubles\nReasoning: At fixed I, the squared current factor is constant and P scales directly with R.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Halves",
          "Quadruples",
          "Cannot change",
          "Doubles"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U04-Q13",
        "type": "choice",
        "prompt": "Which step should precede substitution?",
        "explain": "Compatible units prevent prefix errors and help interpret the result.",
        "rubric": "Expected answer: Convert the known values to compatible units\nReasoning: Compatible units prevent prefix errors and help interpret the result.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Round every value to an integer",
          "Choose the largest number",
          "Convert the known values to compatible units",
          "Remove unit labels"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U04-Q14",
        "type": "number",
        "prompt": "An ideal 10 V is across 1 kΩ. Enter resistive power in mW.",
        "explain": "P = 10²/1,000 = 0.1 W = 100 mW.",
        "rubric": "Expected answer: 100 mW\nReasoning: P = 10²/1,000 = 0.1 W = 100 mW.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "answer": 100,
        "unit": "mW",
        "tolerance": 1
      }
    ],
    "minutes": 40,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U04",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 4,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Dividing V = IR by R isolates current.",
      "anchors": [
        [
          "Goal 1",
          "Choose a useful form of Ohm’s law"
        ],
        [
          "Goal 2",
          "Convert values before substituting"
        ],
        [
          "Goal 3",
          "Distinguish electrical power from voltage or current"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "You know V and R and want I. Which relation is direct?",
      "outcome": "Calculate voltage, current, resistance and resistive power by matching the equation to the quantities you actually know.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 5,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U05",
    "generated": true,
    "subtrack": "generated",
    "title": "05 · Combine resistor paths",
    "description": "Identify series versus parallel before choosing the arithmetic, and test the result against physical path reasoning.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17, 19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "One path or several branches?",
        "source_ids": [
          "S9",
          "S4"
        ]
      },
      {
        "heading": "Work a parallel example slowly",
        "source_ids": [
          "S9",
          "S4"
        ]
      },
      {
        "heading": "Equal branches provide a useful shortcut",
        "source_ids": [
          "S9",
          "S4"
        ]
      },
      {
        "heading": "Magnitude checks and changing one branch",
        "source_ids": [
          "S9",
          "S4"
        ]
      }
    ],
    "objectives": [
      "Add resistances in one series path",
      "Use reciprocal addition for parallel paths",
      "Apply magnitude checks to catch network mistakes"
    ],
    "html": "<p>Identify series versus parallel before choosing the arithmetic, and test the result against physical path reasoning.</p><h3>One path or several branches?</h3><p>Series resistors lie in one path, so their resistances add. If the values are 1 kΩ and 2 kΩ, the total is 3 kΩ. Parallel resistors provide separate paths between the same two nodes. Their equivalent resistance is found by adding reciprocal resistances and taking the reciprocal of that sum.</p><p></p><p>The circuit arrangement chooses the rule. The fact that a page lists several resistor values does not tell you whether to add them directly. First identify how the paths connect.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Work a parallel example slowly</h3><p>For 6 Ω in parallel with 3 Ω, start with 1/R_T = 1/6 + 1/3. Use a common denominator: 1/6 + 2/6 = 3/6 = 1/2. That sum has units of inverse ohms. Take its reciprocal to obtain R_T = 2 Ω.</p><p></p><p>For two positive resistors, you can also use R_T = R₁R₂/(R₁ + R₂). Here 6 × 3/(6 + 3) = 18/9 = 2 Ω. The shortcut is for two branches, not a rule to multiply every resistor in a larger network.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Equal branches provide a useful shortcut</h3><p>For n equal resistors of resistance R, the parallel total is R/n. Three 1 kΩ branches therefore have an equivalent of 1,000/3 ≈ 333.3 Ω. At an ideal 5 V, each branch carries 5 mA and the total is 15 mA. The same total follows from 5/333.3 ≈ 0.015 A.</p><p></p><p>R/n assumes equal values. If the branches are unequal, use the reciprocal rule rather than averaging their resistances or dividing an arbitrary branch by the number of branches.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p><h3>Magnitude checks and changing one branch</h3><p>A positive series total is larger than any of its individual resistors. A parallel equivalent with at least two positive finite branches is smaller than the smallest branch. The 2 Ω result for 6 Ω and 3 Ω passes that check; 9 Ω would not.</p><p></p><p>In the widget, hold R₂ fixed and increase R₁. The parallel equivalent increases because that branch provides less conductance, but it stays below R₂. Adding another positive parallel branch reduces the total resistance. These checks often find a wrong formula faster than repeating the arithmetic.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Compare two arrangements",
        "prompt": "At R₁ = 1,000 Ω and R₂ = 2,000 Ω, compare both totals. Increase R₁ while holding R₂ fixed.",
        "answer": "The series total is 3,000 Ω and the parallel total is about 666.7 Ω initially",
        "explanation": "The same component values produce different equivalent resistance because their paths differ.",
        "source_ids": [
          "S9",
          "S4"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "network"
      },
      {
        "title": "Choose the path rule",
        "prompt": "Two resistor branches join the same pair of nodes. Which calculation fits?",
        "answer": "Add reciprocal resistances, then take the reciprocal",
        "explanation": "Parallel paths share endpoints; their conductance contributions add.",
        "source_ids": [
          "S9",
          "S4"
        ],
        "kind": "choice",
        "choices": [
          "Multiply without dividing",
          "Add reciprocal resistances, then take the reciprocal",
          "Add the resistances directly",
          "Subtract the smaller resistance"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U05-Q01",
        "type": "choice",
        "prompt": "Two resistors share one series path. What combines directly?",
        "explain": "Series total resistance is the sum of individual resistances.",
        "rubric": "Expected answer: Their resistances\nReasoning: Series total resistance is the sum of individual resistances.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "Their resistances",
          "Their reciprocal resistances only",
          "Their voltages regardless of current",
          "Their products"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U05-Q02",
        "type": "choice",
        "prompt": "What is 1 kΩ plus 2 kΩ in series?",
        "explain": "Add values expressed in the same unit.",
        "rubric": "Expected answer: 3 kΩ\nReasoning: Add values expressed in the same unit.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "0.667 kΩ",
          "2 kΩ",
          "0.5 kΩ",
          "3 kΩ"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U05-Q03",
        "type": "choice",
        "prompt": "What is 6 Ω in parallel with 3 Ω?",
        "explain": "The reciprocal sum is 1/2 Ω⁻¹, whose reciprocal is 2 Ω.",
        "rubric": "Expected answer: 2 Ω\nReasoning: The reciprocal sum is 1/2 Ω⁻¹, whose reciprocal is 2 Ω.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "3 Ω",
          "18 Ω",
          "2 Ω",
          "9 Ω"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U05-Q04",
        "type": "choice",
        "prompt": "What does 1/R₁ + 1/R₂ represent before taking the reciprocal?",
        "explain": "The reciprocal step is necessary to return to a resistance.",
        "rubric": "Expected answer: A sum with units of inverse ohms\nReasoning: The reciprocal step is necessary to return to a resistance.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "A voltage in volts",
          "A sum with units of inverse ohms",
          "The final resistance in ohms",
          "A current in amperes"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U05-Q05",
        "type": "choice",
        "prompt": "Three equal 1 kΩ resistors in parallel have a total near…",
        "explain": "The equal-branch shortcut gives 1,000/3 Ω.",
        "rubric": "Expected answer: 333 Ω\nReasoning: The equal-branch shortcut gives 1,000/3 Ω.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "333 Ω",
          "3,000 Ω",
          "1,000 Ω",
          "3 Ω"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U05-Q06",
        "type": "choice",
        "prompt": "Which magnitude check fits two positive resistors in parallel?",
        "explain": "An extra conducting path reduces the equivalent resistance.",
        "rubric": "Expected answer: The total is below the smaller resistor\nReasoning: An extra conducting path reduces the equivalent resistance.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "The total exceeds their sum",
          "The total is their average",
          "The total equals the larger one exactly",
          "The total is below the smaller resistor"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U05-Q07",
        "type": "choice",
        "prompt": "Which shortcut is specifically for two parallel resistors?",
        "explain": "It is the algebraic simplification of a two-term reciprocal sum.",
        "rubric": "Expected answer: R₁R₂/(R₁ + R₂)\nReasoning: It is the algebraic simplification of a two-term reciprocal sum.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "R₁/R₂",
          "R₁R₂",
          "R₁R₂/(R₁ + R₂)",
          "R₁ + R₂"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U05-Q08",
        "type": "choice",
        "prompt": "When may R/n be used for parallel branches?",
        "explain": "The equality of branch values is part of the shortcut’s assumption.",
        "rubric": "Expected answer: When all n resistors have the same resistance\nReasoning: The equality of branch values is part of the shortcut’s assumption.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "Only when the total is zero",
          "When all n resistors have the same resistance",
          "For any unequal resistor list",
          "Only for two unequal values"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U05-Q09",
        "type": "choice",
        "prompt": "Adding another finite positive parallel branch generally makes equivalent resistance…",
        "explain": "The reciprocal sum increases, so its reciprocal decreases.",
        "rubric": "Expected answer: Smaller\nReasoning: The reciprocal sum increases, so its reciprocal decreases.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "Smaller",
          "Larger",
          "Unchanged",
          "Negative"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U05-Q10",
        "type": "number",
        "prompt": "Enter the series total of 2 kΩ, 3 kΩ and 5 kΩ in kΩ.",
        "explain": "Series values add: 2 + 3 + 5 = 10 kΩ.",
        "rubric": "Expected answer: 10 kΩ\nReasoning: Series values add: 2 + 3 + 5 = 10 kΩ.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "answer": 10,
        "unit": "kΩ",
        "tolerance": 0.1
      },
      {
        "id": "C3-CURATED-U05-Q11",
        "type": "choice",
        "prompt": "With an ideal 5 V on three 1 kΩ parallel branches, total current is…",
        "explain": "Each branch carries 5 mA and the source current is their sum.",
        "rubric": "Expected answer: 15 mA\nReasoning: Each branch carries 5 mA and the source current is their sum.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "5 mA",
          "1.67 mA",
          "15 A",
          "15 mA"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U05-Q12",
        "type": "choice",
        "prompt": "A calculated parallel total for 1 kΩ and 2 kΩ is 3 kΩ. What most likely happened?",
        "explain": "3 kΩ is the series sum; the parallel equivalent should be below 1 kΩ.",
        "rubric": "Expected answer: The series rule was used instead\nReasoning: 3 kΩ is the series sum; the parallel equivalent should be below 1 kΩ.",
        "safety": false,
        "source_ids": [
          "S9",
          "S4"
        ],
        "choices": [
          "The total was rounded appropriately",
          "Equal-branch division was used correctly",
          "The series rule was used instead",
          "The reciprocal rule produced the correct result"
        ],
        "correct": 2
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U05",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 5,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Series total resistance is the sum of individual resistances.",
      "anchors": [
        [
          "Goal 1",
          "Add resistances in one series path"
        ],
        [
          "Goal 2",
          "Use reciprocal addition for parallel paths"
        ],
        [
          "Goal 3",
          "Apply magnitude checks to catch network mistakes"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Two resistors share one series path. What combines directly?",
      "outcome": "Identify series versus parallel before choosing the arithmetic, and test the result against physical path reasoning.",
      "missionType": "circuit"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 6,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U06",
    "generated": true,
    "subtrack": "generated",
    "title": "06 · Explain a battery’s voltage sag",
    "description": "Distinguish internal EMF from loaded terminal voltage with a simple series-resistance model.",
    "module": "Associate CET Study Guide",
    "sourcePages": "17, 18, 19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "The model has two resistances",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "heading": "Work a complete hypothetical example",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "heading": "Connect the numbers to sag",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      },
      {
        "heading": "Keep a source example and a teaching model separate",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ]
      }
    ],
    "objectives": [
      "Include internal resistance in the current path",
      "Calculate an internal voltage drop",
      "Explain why loaded terminal voltage is below EMF"
    ],
    "html": "<p>Distinguish internal EMF from loaded terminal voltage with a simple series-resistance model.</p><h3>The model has two resistances</h3><p>EMF is the source voltage in the battery model. Internal resistance r is placed in series with the external load R. The current must pass through both, so the total resistance is R + r.</p><p></p><p>That makes I = EMF/(R + r). Do not use only R unless you are intentionally using an ideal source model with negligible internal resistance. The two models answer different questions; neither lets you infer a real battery’s internal resistance from its label alone.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Work a complete hypothetical example</h3><p>Let EMF = 6 V, the load be 5 Ω, and internal resistance be 1 Ω. Total resistance is 6 Ω, giving I = 6/6 = 1 A. The internal drop is Ir = 1 × 1 = 1 V. The voltage across the load is IR = 1 × 5 = 5 V.</p><p></p><p>The voltages add: 1 V inside the model plus 5 V at its terminals equals the 6 V EMF. You can also obtain terminal voltage as EMF − Ir. Using both routes checks that the same current and resistances were used consistently.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Connect the numbers to sag</h3><p>Terminal voltage is the voltage available across the external load. For positive internal resistance and nonzero load current, it is less than EMF. If the load resistance becomes very large, current becomes small and the internal drop becomes small.</p><p></p><p>Decrease the load resistance in the widget. The current increases, so the internal voltage drop grows. Terminal voltage falls even though the model’s EMF setting has not changed. This is a model of load-dependent sag, not a command to short or heavily load a real battery.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Keep a source example and a teaching model separate</h3><p>The saved source example gives I = 1.5 V/6.25 Ω = 0.24 A, or 240 mA. That denominator includes the external and internal series resistances. Our 6 V example uses different explicitly hypothetical values to make the separate drops easy to see.</p><p></p><p>Always identify whether a voltage is EMF or terminal voltage. Reporting the 6 V setting as a measured loaded terminal voltage in our example would ignore the 1 V internal drop. A calculation does not establish safe real-battery ratings or a test method.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Watch the loaded voltage",
        "prompt": "Set EMF = 6 V, load = 5 Ω and internal resistance = 1 Ω. Then raise internal resistance while leaving the other settings fixed.",
        "answer": "Current and terminal voltage fall",
        "explanation": "The increasing total resistance lowers current, and a greater fraction of EMF is lost internally.",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "internal"
      },
      {
        "title": "Locate the missing volt",
        "prompt": "In the 6 V model, the load reads 5 V. Where is the other volt?",
        "answer": "Across the modeled internal resistance",
        "explanation": "Series voltage drops account for the EMF: 1 V internally and 5 V externally.",
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "kind": "choice",
        "choices": [
          "Across the modeled internal resistance",
          "Destroyed by the equals sign",
          "Across an imaginary parallel load",
          "Not present in the model"
        ],
        "correct": 0,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U06-Q01",
        "type": "choice",
        "prompt": "Where does internal resistance sit in this battery model?",
        "explain": "The load current passes through both external and internal resistance.",
        "rubric": "Expected answer: In series with the external load\nReasoning: The load current passes through both external and internal resistance.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "In series with the external load",
          "In parallel with the voltmeter only",
          "Outside the current path",
          "As a second voltage source"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U06-Q02",
        "type": "choice",
        "prompt": "Which denominator belongs in the modeled current equation?",
        "explain": "Series resistances add before dividing EMF by total resistance.",
        "rubric": "Expected answer: R_load + r_internal\nReasoning: Series resistances add before dividing EMF by total resistance.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "R_load only in every case",
          "R_load − r_internal",
          "R_load × r_internal",
          "R_load + r_internal"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U06-Q03",
        "type": "choice",
        "prompt": "For 6 V EMF, 5 Ω load and 1 Ω internal resistance, current is…",
        "explain": "Total resistance is 6 Ω; 6 V/6 Ω = 1 A.",
        "rubric": "Expected answer: 1 A\nReasoning: Total resistance is 6 Ω; 6 V/6 Ω = 1 A.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "6 A",
          "0.167 A",
          "1 A",
          "1.2 A"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U06-Q04",
        "type": "choice",
        "prompt": "For that example, loaded terminal voltage is…",
        "explain": "The internal drop is 1 A × 1 Ω = 1 V, leaving 5 V at the load.",
        "rubric": "Expected answer: 5 V\nReasoning: The internal drop is 1 A × 1 Ω = 1 V, leaving 5 V at the load.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "7 V",
          "5 V",
          "6 V",
          "1 V"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U06-Q05",
        "type": "choice",
        "prompt": "With positive internal resistance, increased current makes the internal drop…",
        "explain": "The internal voltage drop is Ir.",
        "rubric": "Expected answer: Larger\nReasoning: The internal voltage drop is Ir.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "Larger",
          "Smaller",
          "Always zero",
          "Independent of current"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U06-Q06",
        "type": "choice",
        "prompt": "Why can a lightly loaded terminal voltage approach EMF?",
        "explain": "As current tends toward zero, Ir tends toward zero.",
        "rubric": "Expected answer: Small current gives a small internal drop\nReasoning: As current tends toward zero, Ir tends toward zero.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "The load becomes a second battery",
          "Internal resistance becomes negative",
          "EMF must always be zero",
          "Small current gives a small internal drop"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U06-Q07",
        "type": "number",
        "prompt": "Calculate 1.5 V/6.25 Ω and enter current in mA.",
        "explain": "The quotient is 0.24 A; multiplying by 1,000 gives 240 mA.",
        "rubric": "Expected answer: 240 mA\nReasoning: The quotient is 0.24 A; multiplying by 1,000 gives 240 mA.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "answer": 240,
        "unit": "mA",
        "tolerance": 2.4
      },
      {
        "id": "C3-CURATED-U06-Q08",
        "type": "choice",
        "prompt": "Which pair is consistent in the 6 V example?",
        "explain": "The two series drops must sum to the EMF.",
        "rubric": "Expected answer: 1 V internal drop plus 5 V load drop\nReasoning: The two series drops must sum to the EMF.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "5 V internal drop plus 5 V load drop",
          "6 V internal drop plus 6 V load drop",
          "1 V internal drop plus 5 V load drop",
          "1 V internal drop plus 6 V load drop"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U06-Q09",
        "type": "choice",
        "prompt": "What does the numerical model establish about a real battery’s safe short-circuit test?",
        "explain": "The source extraction supplies a calculation model, not equipment ratings or a laboratory procedure.",
        "rubric": "Expected answer: Nothing; it is not a safe-test procedure\nReasoning: The source extraction supplies a calculation model, not equipment ratings or a laboratory procedure.",
        "safety": false,
        "source_ids": [
          "S6",
          "S4",
          "S9"
        ],
        "choices": [
          "That the label gives exact loaded voltage",
          "Nothing; it is not a safe-test procedure",
          "That shorting it is safe",
          "That all batteries have 1 Ω internal resistance"
        ],
        "correct": 1
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U06",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 6,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The load current passes through both external and internal resistance.",
      "anchors": [
        [
          "Goal 1",
          "Include internal resistance in the current path"
        ],
        [
          "Goal 2",
          "Calculate an internal voltage drop"
        ],
        [
          "Goal 3",
          "Explain why loaded terminal voltage is below EMF"
        ]
      ],
      "caution": "Virtual battery models do not authorize shorting or testing a real battery. Actual source, fuse and component ratings are not supplied here.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Where does internal resistance sit in this battery model?",
      "outcome": "Distinguish internal EMF from loaded terminal voltage with a simple series-resistance model.",
      "missionType": "circuit"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 7,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U07",
    "generated": true,
    "subtrack": "generated",
    "title": "07 · Read a sine wave’s amplitudes",
    "description": "Separate signed instantaneous voltage from peak, peak-to-peak and sinusoidal RMS values.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "One cycle includes both polarities",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "Peak and peak-to-peak answer different questions",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "What the RMS conversion means here",
        "source_ids": [
          "S7"
        ]
      },
      {
        "heading": "Use precision honestly",
        "source_ids": [
          "S7"
        ]
      }
    ],
    "objectives": [
      "Locate a sine wave’s positive and negative extrema",
      "Convert peak and peak-to-peak values",
      "Apply RMS conversion only to a sine wave"
    ],
    "html": "<p>Separate signed instantaneous voltage from peak, peak-to-peak and sinusoidal RMS values.</p><h3>One cycle includes both polarities</h3><p>A sine wave goes through a repeating cycle. The source figure shows 0° through 360°, with a positive extreme at 90° and a negative extreme at 270°. A negative instantaneous voltage is a signed value relative to the chosen reference; it is not a negative amplitude magnitude.</p><p></p><p>If a centered sine wave reaches +10 V and −10 V, its peak magnitude is 10 V. The distance from its lowest to highest voltage is 20 V, which is its peak-to-peak value.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>Peak and peak-to-peak answer different questions</h3><p>For the centered sine wave in this lesson, V_pp = 2V_p. A 6 V peak corresponds to 12 V peak-to-peak. Going the other direction divides by two: a 24 V peak-to-peak sine wave has a 12 V peak.</p><p></p><p>Read the amplitude label before entering a number into another equation. Calling a 20 V peak-to-peak value a 20 V peak value makes the assumed amplitude twice too large. The waveform widget shows the positive and negative extremes together.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>What the RMS conversion means here</h3><p>For an ideal sinusoid, V_rms = V_p/√2, approximately 0.707V_p. Conversely, V_p = √2V_rms, approximately 1.414V_rms. A 10 V peak sine wave therefore has approximately 7.07 V RMS. Its peak-to-peak value remains 20 V.</p><p></p><p>RMS is a different amplitude measure with an equivalent heating interpretation for a resistor under appropriate conditions. The sine-wave conversion factor is not a universal rule for a square wave, pulse train or arbitrary signal.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p><h3>Use precision honestly</h3><p>The chapter supplies rounded factors 0.707, 1.414 and 2.828. Their products may not return exactly one because they are rounded. Keep adequate precision until the final answer and use an approximation sign when applying these factors.</p><p></p><p>Start from a known labeled measure, choose the corresponding conversion, then check order: for a nonzero centered sine wave, RMS magnitude is below peak magnitude, and peak-to-peak is twice peak. Source examples with high voltages are paper calculations, not practical measurement instructions.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Inspect the two extremes",
        "prompt": "Set peak amplitude to 10 V, then 20 V. Observe the waveform, RMS and peak-to-peak outputs.",
        "answer": "Both amplitude measures double when peak doubles",
        "explanation": "The conversion factors are constant for the ideal sinusoidal shape.",
        "source_ids": [
          "S7"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "sine"
      },
      {
        "title": "Choose the amplitude label",
        "prompt": "A display says 12 V peak-to-peak for a centered sine wave. Which peak belongs to it?",
        "answer": "6 V",
        "explanation": "The peak-to-peak span includes both the positive and negative excursions.",
        "source_ids": [
          "S7"
        ],
        "kind": "choice",
        "choices": [
          "24 V",
          "8.484 V",
          "6 V",
          "12 V"
        ],
        "correct": 2,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U07-Q01",
        "type": "choice",
        "prompt": "A centered sine wave runs from +10 V to −10 V. Its peak-to-peak value is…",
        "explain": "Peak-to-peak is maximum minus minimum: 10 − (−10) = 20 V.",
        "rubric": "Expected answer: 20 V\nReasoning: Peak-to-peak is maximum minus minimum: 10 − (−10) = 20 V.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "10 V",
          "0 V",
          "−20 V",
          "20 V"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U07-Q02",
        "type": "choice",
        "prompt": "The same waveform’s peak magnitude is…",
        "explain": "Peak magnitude is the distance from the zero reference to an extreme.",
        "rubric": "Expected answer: 10 V\nReasoning: Peak magnitude is the distance from the zero reference to an extreme.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "−10 V",
          "7.07 V",
          "10 V",
          "20 V"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U07-Q03",
        "type": "choice",
        "prompt": "Where is the positive extreme in the source’s standard cycle?",
        "explain": "The figure places the positive crest at a quarter cycle.",
        "rubric": "Expected answer: 90°\nReasoning: The figure places the positive crest at a quarter cycle.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "270°",
          "90°",
          "0°",
          "180°"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U07-Q04",
        "type": "choice",
        "prompt": "For a sine wave, RMS from peak is approximately…",
        "explain": "The ideal sinusoidal relationship is peak divided by √2.",
        "rubric": "Expected answer: 0.707 × peak\nReasoning: The ideal sinusoidal relationship is peak divided by √2.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "0.707 × peak",
          "2 × peak",
          "1.414 × peak",
          "Peak divided by 2"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U07-Q05",
        "type": "choice",
        "prompt": "A 10 V peak ideal sine wave has RMS near…",
        "explain": "10/√2 is approximately 7.071 V.",
        "rubric": "Expected answer: 7.07 V\nReasoning: 10/√2 is approximately 7.071 V.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "14.14 V",
          "20 V",
          "5 V",
          "7.07 V"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U07-Q06",
        "type": "choice",
        "prompt": "Which order fits a centered nonzero sine wave?",
        "explain": "The sinusoidal factor is below one, and peak-to-peak is twice peak.",
        "rubric": "Expected answer: RMS < peak < peak-to-peak\nReasoning: The sinusoidal factor is below one, and peak-to-peak is twice peak.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "Peak-to-peak < peak < RMS",
          "All three are equal",
          "RMS < peak < peak-to-peak",
          "Peak < RMS < peak-to-peak"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U07-Q07",
        "type": "choice",
        "prompt": "May the 0.707 factor be assumed for any arbitrary waveform?",
        "explain": "Different waveform shapes have different relationships between peak and RMS.",
        "rubric": "Expected answer: No; this conversion is sinusoid-specific\nReasoning: Different waveform shapes have different relationships between peak and RMS.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "Only when voltage is negative",
          "No; this conversion is sinusoid-specific",
          "Yes, for every waveform",
          "Only when frequency exceeds 1 kHz"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U07-Q08",
        "type": "number",
        "prompt": "A centered sine wave has 18 V peak-to-peak. Enter its peak magnitude in V.",
        "explain": "For this waveform, divide peak-to-peak by two.",
        "rubric": "Expected answer: 9 V\nReasoning: For this waveform, divide peak-to-peak by two.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "answer": 9,
        "unit": "V",
        "tolerance": 0.09
      },
      {
        "id": "C3-CURATED-U07-Q09",
        "type": "choice",
        "prompt": "Why might reverse conversions using 0.707 and 1.414 not recover an exact original value?",
        "explain": "Use adequate precision and treat rounded-factor results as approximations.",
        "rubric": "Expected answer: The displayed factors are rounded\nReasoning: Use adequate precision and treat rounded-factor results as approximations.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "The displayed factors are rounded",
          "The waveform must be unsafe",
          "RMS cannot be reversed",
          "The negative half-cycle is missing"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U07-Q10",
        "type": "choice",
        "prompt": "At 270° in the standard cycle, the instantaneous value is at its…",
        "explain": "The negative trough is a signed instantaneous value, not a negative peak magnitude.",
        "rubric": "Expected answer: Negative extreme\nReasoning: The negative trough is a signed instantaneous value, not a negative peak magnitude.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "Positive extreme",
          "RMS value",
          "Peak-to-peak value",
          "Negative extreme"
        ],
        "correct": 3
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U07",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 7,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Peak-to-peak is maximum minus minimum: 10 − (−10) = 20 V.",
      "anchors": [
        [
          "Goal 1",
          "Locate a sine wave’s positive and negative extrema"
        ],
        [
          "Goal 2",
          "Convert peak and peak-to-peak values"
        ],
        [
          "Goal 3",
          "Apply RMS conversion only to a sine wave"
        ]
      ],
      "caution": "All waveforms here are idealized. The chapter’s higher-voltage examples are paper exercises, not instructions to probe live equipment.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "A centered sine wave runs from +10 V to −10 V. Its peak-to-peak value is…",
      "outcome": "Separate signed instantaneous voltage from peak, peak-to-peak and sinusoidal RMS values.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 8,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U08",
    "generated": true,
    "subtrack": "generated",
    "title": "08 · Move between period and frequency",
    "description": "Use reciprocal relationships and unit conversions to describe how often a waveform repeats and how long one cycle lasts.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17, 19",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Two views of one repeating signal",
        "source_ids": [
          "S8",
          "S2"
        ]
      },
      {
        "heading": "Work from milliseconds to hertz",
        "source_ids": [
          "S8",
          "S2"
        ]
      },
      {
        "heading": "Work from kilohertz to period",
        "source_ids": [
          "S8",
          "S2"
        ]
      },
      {
        "heading": "Report an approximation without rewriting the source",
        "source_ids": [
          "S8",
          "S2"
        ]
      }
    ],
    "objectives": [
      "Separate cycles per second from seconds per cycle",
      "Convert ms and kHz before using a reciprocal",
      "Check reciprocal results by multiplication"
    ],
    "html": "<p>Use reciprocal relationships and unit conversions to describe how often a waveform repeats and how long one cycle lasts.</p><h3>Two views of one repeating signal</h3><p>Frequency f counts cycles per second and is measured in hertz. Period T is the time required for one complete cycle and is measured in seconds. A 100 Hz waveform repeats 100 times each second; each cycle therefore occupies 1/100 second.</p><p></p><p>The relationships are T = 1/f and f = 1/T. They are reciprocals, not equal numerical quantities. A higher frequency corresponds to a shorter period because more cycles must fit into the same second.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Work from milliseconds to hertz</h3><p>For a hypothetical period of 2 ms, first convert: 2 ms = 0.002 s. Then f = 1/0.002 = 500 Hz. Check by multiplying: 500 cycles/s × 0.002 s/cycle = 1.</p><p></p><p>Entering 2 into a seconds-based formula would describe a 2-second period and give 0.5 Hz. The missing milli-prefix causes a thousandfold frequency error. Read the time unit before touching the reciprocal key.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Work from kilohertz to period</h3><p>A frequency of 2 kHz is 2,000 Hz. Period is 1/2,000 = 0.0005 s, or 0.5 ms. A useful compatible-unit relation is T in ms = 1/f in kHz, but understand why it works before using it as a shortcut.</p><p></p><p>In the widget, raise frequency from 1,000 to 2,000 Hz. The period falls from 1 ms to 0.5 ms. Doubling either quantity halves its reciprocal; it does not make both larger.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Report an approximation without rewriting the source</h3><p>The saved extraction flags the chapter’s display of 1/60 s as 16.6 ms without an approximation sign. The exact reciprocal is a repeating decimal; ordinary rounding to the nearest tenth of a millisecond gives 16.7 ms.</p><p></p><p>This lesson identifies 16.6 ms as the source’s approximate displayed value rather than claiming exact equality or nearest-tenth rounding. Keep calculator precision until the last step and label your rounded result appropriately.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Fit more cycles into a second",
        "prompt": "Compare 1,000 Hz and 2,000 Hz. Predict the two periods, then move the control.",
        "answer": "1 ms changes to 0.5 ms",
        "explanation": "Frequency increases while the time occupied by a single cycle decreases.",
        "source_ids": [
          "S8",
          "S2"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "period"
      },
      {
        "title": "Choose the first step",
        "prompt": "A problem gives T = 5 ms and asks for f in Hz. What should you do first?",
        "answer": "Convert 5 ms to 0.005 s",
        "explanation": "Compatible units come before the reciprocal: 1/0.005 s = 200 Hz.",
        "source_ids": [
          "S8",
          "S2"
        ],
        "kind": "choice",
        "choices": [
          "Square 5 ms",
          "Convert 5 ms to 0.005 s",
          "Use 5 as seconds",
          "Multiply 5 by the voltage"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U08-Q01",
        "type": "choice",
        "prompt": "Frequency describes…",
        "explain": "Hertz measures repetitions per second.",
        "rubric": "Expected answer: Cycles per second\nReasoning: Hertz measures repetitions per second.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "Cycles per volt",
          "Cycles per second",
          "Seconds per cycle",
          "Volts per cycle"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U08-Q02",
        "type": "choice",
        "prompt": "Period describes…",
        "explain": "Period is a duration, measured in seconds.",
        "rubric": "Expected answer: Time for one complete cycle\nReasoning: Period is a duration, measured in seconds.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "Time for one complete cycle",
          "Number of cycles in one second",
          "The signal’s peak voltage",
          "Its RMS voltage"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U08-Q03",
        "type": "choice",
        "prompt": "Which relation obtains frequency from period in seconds?",
        "explain": "Frequency and period are reciprocals.",
        "rubric": "Expected answer: f = 1/T\nReasoning: Frequency and period are reciprocals.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "f = T",
          "f = 2T",
          "f = T²",
          "f = 1/T"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U08-Q04",
        "type": "choice",
        "prompt": "A 2 ms period corresponds to…",
        "explain": "2 ms is 0.002 s; its reciprocal is 500 Hz.",
        "rubric": "Expected answer: 500 Hz\nReasoning: 2 ms is 0.002 s; its reciprocal is 500 Hz.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "2,000 Hz",
          "500 kHz",
          "500 Hz",
          "0.5 Hz"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U08-Q05",
        "type": "choice",
        "prompt": "If frequency doubles, period becomes…",
        "explain": "The reciprocal relation makes the changes inverse.",
        "rubric": "Expected answer: Half as long\nReasoning: The reciprocal relation makes the changes inverse.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "Unchanged",
          "Half as long",
          "Twice as long",
          "Four times as long"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U08-Q06",
        "type": "choice",
        "prompt": "What is the period of 2 kHz?",
        "explain": "1/2,000 s = 0.0005 s = 0.5 ms.",
        "rubric": "Expected answer: 0.5 ms\nReasoning: 1/2,000 s = 0.0005 s = 0.5 ms.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "0.5 ms",
          "2 ms",
          "500 ms",
          "0.5 s"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U08-Q07",
        "type": "number",
        "prompt": "A frequency is 100 Hz. Enter its period in ms.",
        "explain": "1/100 = 0.01 s, and 0.01 × 1,000 = 10 ms.",
        "rubric": "Expected answer: 10 ms\nReasoning: 1/100 = 0.01 s, and 0.01 × 1,000 = 10 ms.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "answer": 10,
        "unit": "ms",
        "tolerance": 0.1
      },
      {
        "id": "C3-CURATED-U08-Q08",
        "type": "choice",
        "prompt": "Why is treating 2 ms as 2 s wrong?",
        "explain": "Milli means 10⁻³, so the conversion is essential.",
        "rubric": "Expected answer: The time is represented 1,000 times too large\nReasoning: Milli means 10⁻³, so the conversion is essential.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "The two units are equivalent",
          "It only changes the spelling",
          "Frequency does not depend on units",
          "The time is represented 1,000 times too large"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U08-Q09",
        "type": "choice",
        "prompt": "Which is the correct nearest-tenth-ms rounding for a 60 Hz period?",
        "explain": "1/60 s = 16.666… ms, which rounds to 16.7 ms. The source’s 16.6 display is qualified separately.",
        "rubric": "Expected answer: 16.7 ms\nReasoning: 1/60 s = 16.666… ms, which rounds to 16.7 ms. The source’s 16.6 display is qualified separately.",
        "safety": false,
        "source_ids": [
          "S8",
          "S2"
        ],
        "choices": [
          "60 ms",
          "0.0167 ms",
          "16.7 ms",
          "Exactly 16.6 ms"
        ],
        "correct": 2
      }
    ],
    "minutes": 34,
    "simulator": "period",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U08",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 8,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Hertz measures repetitions per second.",
      "anchors": [
        [
          "Goal 1",
          "Separate cycles per second from seconds per cycle"
        ],
        [
          "Goal 2",
          "Convert ms and kHz before using a reciprocal"
        ],
        [
          "Goal 3",
          "Check reciprocal results by multiplication"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Frequency describes…",
      "outcome": "Use reciprocal relationships and unit conversions to describe how often a waveform repeats and how long one cycle lasts.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 9,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U09",
    "generated": true,
    "subtrack": "generated",
    "title": "09 · Separate capacitor charge from energy",
    "description": "Calculate stored charge and stored energy, then predict why voltage changes affect them differently.",
    "module": "Associate CET Study Guide",
    "sourcePages": "20",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Two quantities are stored, with different units",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Work the charge example from the extraction",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Calculate energy independently",
        "source_ids": [
          "S10"
        ]
      },
      {
        "heading": "Predict the different scaling",
        "source_ids": [
          "S10"
        ]
      }
    ],
    "objectives": [
      "Use Q = CV with capacitance in farads",
      "Use E = ½CV² for electric-field energy",
      "Compare direct and squared voltage scaling"
    ],
    "html": "<p>Calculate stored charge and stored energy, then predict why voltage changes affect them differently.</p><h3>Two quantities are stored, with different units</h3><p>Capacitance C is measured in farads. Charge Q is measured in coulombs and follows Q = CV. Stored energy E is measured in joules and follows E = 0.5CV² in the accepted capacitor model.</p><p></p><p>Charge and energy are related, but they are not interchangeable. One says how much charge is associated with the voltage and capacitance; the other measures stored energy. Write the desired quantity and its unit before choosing a formula.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Work the charge example from the extraction</h3><p>The source uses C = 5 µF and V = 12 V. Convert capacitance: 5 µF = 5 × 10⁻⁶ F. Then Q = (5 × 10⁻⁶)(12) = 60 × 10⁻⁶ C = 60 µC.</p><p></p><p>The final C is the coulomb unit, not the capacitance variable. The multiplication uses capacitance in farads and voltage in volts. A result of 60 C would ignore the micro-prefix and be one million times too large.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Calculate energy independently</h3><p>Using the clear accepted energy formula with those same values gives E = 0.5 × 5 × 10⁻⁶ × 12². Square voltage first: 12² = 144. Half of 5 × 144 is 360, so E = 360 × 10⁻⁶ J = 360 µJ.</p><p></p><p>This is an independently shown teaching calculation from the accepted formula. The extraction flags conflicting right-column source notation that reuses E ambiguously; that expression is not presented as a reliable additional rule.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Predict the different scaling</h3><p>At fixed capacitance, doubling voltage doubles Q = CV but quadruples E = 0.5CV². At fixed voltage, doubling capacitance doubles both. The energy widget displays both quantities so you can compare those effects without confusing their units.</p><p></p><p>In the default 100 µF, 5 V example, charge is 500 µC and energy is 1,250 µJ. Increasing voltage to 10 V produces 1,000 µC and 5,000 µJ. These are virtual calculations, not instructions to charge a real capacitor.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Compare charge and energy responses",
        "prompt": "Keep C = 100 µF. Compare 5 V with 10 V and watch both outputs.",
        "answer": "Charge doubles while energy quadruples",
        "explanation": "The voltage is squared only in the energy expression.",
        "source_ids": [
          "S10"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "energy"
      },
      {
        "title": "Select the squared quantity",
        "prompt": "Which change gives four times the energy at fixed C?",
        "answer": "Double the voltage",
        "explanation": "With capacitance held fixed, 2² produces the fourfold energy factor.",
        "source_ids": [
          "S10"
        ],
        "kind": "choice",
        "choices": [
          "Double the capacitance at fixed voltage",
          "Halve the voltage",
          "Halve the capacitance",
          "Double the voltage"
        ],
        "correct": 3,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U09-Q01",
        "type": "choice",
        "prompt": "Which formula gives capacitor charge?",
        "explain": "Charge is directly proportional to capacitance and voltage.",
        "rubric": "Expected answer: Q = CV\nReasoning: Charge is directly proportional to capacitance and voltage.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "Q = CV",
          "Q = C/V",
          "Q = 0.5CV²",
          "Q = V²/C"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U09-Q02",
        "type": "choice",
        "prompt": "Which unit belongs to charge?",
        "explain": "Farad measures capacitance; joule measures energy.",
        "rubric": "Expected answer: Coulomb\nReasoning: Farad measures capacitance; joule measures energy.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "Farad",
          "Joule",
          "Watt",
          "Coulomb"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U09-Q03",
        "type": "choice",
        "prompt": "For 5 µF at 12 V, stored charge is…",
        "explain": "(5 × 10⁻⁶ F)(12 V) = 60 × 10⁻⁶ C.",
        "rubric": "Expected answer: 60 µC\nReasoning: (5 × 10⁻⁶ F)(12 V) = 60 × 10⁻⁶ C.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "360 µJ",
          "2.4 µC",
          "60 µC",
          "60 C"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U09-Q04",
        "type": "choice",
        "prompt": "Which accepted formula gives stored energy?",
        "explain": "Voltage is squared and the one-half factor is retained.",
        "rubric": "Expected answer: E = 0.5CV²\nReasoning: Voltage is squared and the one-half factor is retained.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "E = 2CV",
          "E = 0.5CV²",
          "E = CV",
          "E = C/V²"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U09-Q05",
        "type": "choice",
        "prompt": "Using 5 µF and 12 V, energy from that formula is…",
        "explain": "0.5 × 5 × 10⁻⁶ × 144 = 360 × 10⁻⁶ J.",
        "rubric": "Expected answer: 360 µJ\nReasoning: 0.5 × 5 × 10⁻⁶ × 144 = 360 × 10⁻⁶ J.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "360 µJ",
          "60 µJ",
          "720 µJ",
          "360 J"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U09-Q06",
        "type": "choice",
        "prompt": "At fixed C, doubling V changes Q and E how?",
        "explain": "Charge depends on V and energy on V².",
        "rubric": "Expected answer: Q doubles; E quadruples\nReasoning: Charge depends on V and energy on V².",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "Both double",
          "Both quadruple",
          "Q quadruples; E doubles",
          "Q doubles; E quadruples"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U09-Q07",
        "type": "choice",
        "prompt": "At fixed V, doubling C changes stored energy how?",
        "explain": "Capacitance appears to the first power in 0.5CV².",
        "rubric": "Expected answer: It doubles\nReasoning: Capacitance appears to the first power in 0.5CV².",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "It halves",
          "It stays fixed",
          "It doubles",
          "It quadruples"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U09-Q08",
        "type": "number",
        "prompt": "For 10 µF at 5 V, enter stored charge in µC.",
        "explain": "Q = 10 µF × 5 V = 50 µC.",
        "rubric": "Expected answer: 50 µC\nReasoning: Q = 10 µF × 5 V = 50 µC.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "answer": 50,
        "unit": "µC",
        "tolerance": 0.5
      },
      {
        "id": "C3-CURATED-U09-Q09",
        "type": "choice",
        "prompt": "What is wrong with reporting 60 µF as the charge answer?",
        "explain": "The unit identifies the kind of quantity, independent of its number.",
        "rubric": "Expected answer: Farad is a capacitance unit, not a charge unit\nReasoning: The unit identifies the kind of quantity, independent of its number.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "The number must be negative",
          "Farad is a capacitance unit, not a charge unit",
          "The micro-prefix is forbidden",
          "Charge cannot be calculated"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U09-Q10",
        "type": "choice",
        "prompt": "How is the disputed right-column energy notation handled here?",
        "explain": "The source discrepancy is disclosed rather than silently treated as verified notation.",
        "rubric": "Expected answer: Use the clear accepted formula and label the worked calculation independently\nReasoning: The source discrepancy is disclosed rather than silently treated as verified notation.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "Use the clear accepted formula and label the worked calculation independently",
          "Treat every E as the same quantity without definition",
          "Copy the ambiguous expression as a second rule",
          "Discard all capacitor mathematics"
        ],
        "correct": 0
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U09",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 9,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Charge is directly proportional to capacitance and voltage.",
      "anchors": [
        [
          "Goal 1",
          "Use Q = CV with capacitance in farads"
        ],
        [
          "Goal 2",
          "Use E = ½CV² for electric-field energy"
        ],
        [
          "Goal 3",
          "Compare direct and squared voltage scaling"
        ]
      ],
      "caution": "Stored-energy examples and sliders do not authorize charging or handling physical capacitors. Real stored charge can create hazards.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Which formula gives capacitor charge?",
      "outcome": "Calculate stored charge and stored energy, then predict why voltage changes affect them differently.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 10,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U10",
    "generated": true,
    "subtrack": "generated",
    "title": "10 · Combine capacitances without using the resistor rule",
    "description": "Choose the capacitor series or parallel relationship and use a magnitude check to verify the result.",
    "module": "Associate CET Study Guide",
    "sourcePages": "19, 20, 21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Capacitors combine differently from resistors",
        "source_ids": [
          "S12",
          "S9"
        ]
      },
      {
        "heading": "A parallel example",
        "source_ids": [
          "S12",
          "S9"
        ]
      },
      {
        "heading": "A series example",
        "source_ids": [
          "S12",
          "S9"
        ]
      },
      {
        "heading": "Check the scale before trusting the display",
        "source_ids": [
          "S12",
          "S9"
        ]
      }
    ],
    "objectives": [
      "Add capacitance directly in parallel",
      "Combine series capacitances by reciprocals",
      "Explain the difference from resistor combinations"
    ],
    "html": "<p>Choose the capacitor series or parallel relationship and use a magnitude check to verify the result.</p><h3>Capacitors combine differently from resistors</h3><p>The accepted chapter relationships give direct addition for parallel capacitance: C_T = C₁ + C₂ + …. Series capacitance uses reciprocal addition: 1/C_T = 1/C₁ + 1/C₂ + ….</p><p></p><p>Do not transfer the resistor rule solely because the words series and parallel look familiar. The relevant component quantity is different. Decide the component type and its arrangement before selecting a formula.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>A parallel example</h3><p>Two 10 µF capacitors in parallel give C_T = 10 + 10 = 20 µF. Keep all values in the same unit while adding. If one value is given in nF and another in µF, convert one before adding their numbers.</p><p></p><p>The source material spans pp. 20–21. The saved extraction supports the numerical examples across those pages but does not justify assigning each example to one precise page, so the attribution remains collective.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>A series example</h3><p>Three equal 10 µF capacitors in series give C_T = C/n = 10/3 µF ≈ 3.33 µF. For two unequal capacitors, product-over-sum is convenient: C_T = C₁C₂/(C₁ + C₂). For 10 µF and 20 µF, this gives 200/30 ≈ 6.67 µF.</p><p></p><p>The shortcut is limited to two series capacitors. For a larger set, add all reciprocals and invert the resulting sum. Rounding too early can spoil the final reciprocal.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p><h3>Check the scale before trusting the display</h3><p>For at least two positive finite capacitances in series, the equivalent is below the smallest individual capacitance. In parallel, the total exceeds each individual value. Thus the 6.67 µF series result is sensible for 10 and 20 µF, while 30 µF would describe their parallel total.</p><p></p><p>Use the widget to change one capacitance and compare both arrangements. The total responds continuously, but the series and parallel outputs follow different rules. These are idealized capacitances, without claims about a physical capacitor’s voltage rating or stored-energy safety.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Try the same values in both arrangements",
        "prompt": "Set C₁ = 10 µF and C₂ = 20 µF. Compare the series and parallel results.",
        "answer": "Series is about 6.67 µF; parallel is 30 µF",
        "explanation": "The reciprocal series relationship and direct parallel addition describe different arrangements.",
        "source_ids": [
          "S12",
          "S9"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "capnetwork"
      },
      {
        "title": "Catch the swapped rule",
        "prompt": "A student adds three 10 µF series capacitors to get 30 µF. What is wrong?",
        "answer": "The parallel addition rule was used for series",
        "explanation": "Equal series capacitances divide by the number of capacitors, giving about 3.33 µF.",
        "source_ids": [
          "S12",
          "S9"
        ],
        "kind": "choice",
        "choices": [
          "The capacitors are automatically unequal",
          "Capacitance cannot have a prefix",
          "The parallel addition rule was used for series",
          "The correct answer is negative"
        ],
        "correct": 2,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U10-Q01",
        "type": "choice",
        "prompt": "Two positive capacitances in parallel combine by…",
        "explain": "The accepted parallel relation is C_T = C₁ + C₂.",
        "rubric": "Expected answer: Direct addition\nReasoning: The accepted parallel relation is C_T = C₁ + C₂.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "Taking their simple average",
          "Dividing the larger by the smaller",
          "Direct addition",
          "Subtracting their values"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U10-Q02",
        "type": "choice",
        "prompt": "Two 10 µF capacitors in parallel give…",
        "explain": "Parallel capacitances add: 10 + 10 = 20 µF.",
        "rubric": "Expected answer: 20 µF\nReasoning: Parallel capacitances add: 10 + 10 = 20 µF.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "100 µF",
          "20 µF",
          "5 µF",
          "10 µF"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U10-Q03",
        "type": "choice",
        "prompt": "Three equal 10 µF capacitors in series give approximately…",
        "explain": "For equal series capacitances, C_T = C/n.",
        "rubric": "Expected answer: 3.33 µF\nReasoning: For equal series capacitances, C_T = C/n.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "3.33 µF",
          "30 µF",
          "10 µF",
          "0.1 µF"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U10-Q04",
        "type": "choice",
        "prompt": "Which relation fits two series capacitors?",
        "explain": "The two-term reciprocal sum simplifies to product-over-sum.",
        "rubric": "Expected answer: C₁C₂/(C₁ + C₂)\nReasoning: The two-term reciprocal sum simplifies to product-over-sum.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "C₁ + C₂",
          "C₁ − C₂",
          "C₁C₂ alone",
          "C₁C₂/(C₁ + C₂)"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U10-Q05",
        "type": "choice",
        "prompt": "A series total for 10 and 20 µF should be…",
        "explain": "For two positive finite series capacitances, the total is below the smaller one.",
        "rubric": "Expected answer: Less than 10 µF\nReasoning: For two positive finite series capacitances, the total is below the smaller one.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "Exactly 30 µF",
          "Their arithmetic average",
          "Less than 10 µF",
          "More than 20 µF"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U10-Q06",
        "type": "choice",
        "prompt": "What is approximately 10 µF in series with 20 µF?",
        "explain": "10 × 20/(10 + 20) = 200/30 ≈ 6.67 µF.",
        "rubric": "Expected answer: 6.67 µF\nReasoning: 10 × 20/(10 + 20) = 200/30 ≈ 6.67 µF.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "200 µF",
          "6.67 µF",
          "30 µF",
          "15 µF"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U10-Q07",
        "type": "number",
        "prompt": "Enter the parallel total of 4 µF and 6 µF in µF.",
        "explain": "Parallel capacitances add: 4 + 6 = 10 µF.",
        "rubric": "Expected answer: 10 µF\nReasoning: Parallel capacitances add: 4 + 6 = 10 µF.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "answer": 10,
        "unit": "µF",
        "tolerance": 0.1
      },
      {
        "id": "C3-CURATED-U10-Q08",
        "type": "choice",
        "prompt": "Why can’t you add a bare 500 nF number to a bare 1 µF number?",
        "explain": "500 nF = 0.5 µF; compatible units must precede addition.",
        "rubric": "Expected answer: The numbers use different unit scales\nReasoning: 500 nF = 0.5 µF; compatible units must precede addition.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "The numbers use different unit scales",
          "Capacitances cannot combine",
          "Nanofarads are negative",
          "A reciprocal is always forbidden"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U10-Q09",
        "type": "choice",
        "prompt": "Which statement correctly compares component rules?",
        "explain": "The arrangement words alone do not specify how the component quantity combines.",
        "rubric": "Expected answer: Resistors add in series; capacitors add in parallel\nReasoning: The arrangement words alone do not specify how the component quantity combines.",
        "safety": false,
        "source_ids": [
          "S12",
          "S9"
        ],
        "choices": [
          "Both always add in series",
          "Both always add in parallel",
          "Neither can use reciprocals",
          "Resistors add in series; capacitors add in parallel"
        ],
        "correct": 3
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U10",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 10,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The accepted parallel relation is C_T = C₁ + C₂.",
      "anchors": [
        [
          "Goal 1",
          "Add capacitance directly in parallel"
        ],
        [
          "Goal 2",
          "Combine series capacitances by reciprocals"
        ],
        [
          "Goal 3",
          "Explain the difference from resistor combinations"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Two positive capacitances in parallel combine by…",
      "outcome": "Choose the capacitor series or parallel relationship and use a magnitude check to verify the result.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 11,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U11",
    "generated": true,
    "subtrack": "generated",
    "title": "11 · Use a time constant as a timescale",
    "description": "Calculate RC timing and read ideal exponential behavior without mistaking an approximation for exact completion.",
    "module": "Associate CET Study Guide",
    "sourcePages": "20, 21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Resistance and capacitance set the timescale",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Calculate the chapter’s accepted example",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Understand the one-τ charging point",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Five time constants is close, not exact",
        "source_ids": [
          "S11",
          "S10"
        ]
      },
      {
        "heading": "Read a changed graph carefully",
        "source_ids": [
          "S11",
          "S10"
        ]
      }
    ],
    "objectives": [
      "Calculate τ = RC with compatible units",
      "Interpret the accepted one-time-constant charging point",
      "Distinguish approaching a final value from exactly reaching it"
    ],
    "html": "<p>Calculate RC timing and read ideal exponential behavior without mistaking an approximation for exact completion.</p><h3>Resistance and capacitance set the timescale</h3><p>The RC time constant is τ = RC, with resistance in ohms and capacitance in farads. Its unit is second. τ tells you the characteristic pace of the change; it is not a fixed stopwatch time at which every change suddenly stops.</p><p></p><p>At fixed C, larger R gives a larger time constant. At fixed R, larger C also gives a larger time constant. Doubling both therefore multiplies τ by four, which you can test with the two sliders.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Calculate the chapter’s accepted example</h3><p>For R = 10 kΩ and C = 5 µF, convert R to 10,000 Ω and C to 5 × 10⁻⁶ F. Then τ = 10,000 × 5 × 10⁻⁶ = 0.05 s, or 50 ms.</p><p></p><p>A compatible shortcut multiplies kΩ by µF to get milliseconds: 10 × 5 = 50 ms. The shortcut works because 10³ × 10⁻⁶ = 10⁻³. Keep that factor visible so you do not mistakenly label 50 as seconds.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Understand the one-τ charging point</h3><p>The accepted source example gives 63.2 V after one charging time constant for a 100 V final level. That is approximately 63.2% of the final level, leaving approximately 36.8% of the difference still to close. It does not mean the capacitor is fully charged.</p><p></p><p>Our ideal charging graph uses the teaching model fraction = 1 − exp(−t/τ) to represent the exponential behavior. At t = τ, it gives about 0.632. The graph is a calculated model, not a reproduction of the disputed printed labels.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Five time constants is close, not exact</h3><p>In the ideal charging model, five time constants gives approximately 99.3% of the final level. The remaining difference is small but not zero. The response approaches the final level asymptotically rather than becoming mathematically complete at a finite time.</p><p></p><p>The saved extraction flags an incorrect-looking discharge percentage, a repeated final time label and an unqualified completion claim in the source figure. Those labels are not adopted here. Use the accepted τ calculation and the explicitly identified ideal charging model instead.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p><h3>Read a changed graph carefully</h3><p>If τ increases, reaching the same fraction of the final value takes longer. At a fixed elapsed time, the slower charging response has reached a smaller fraction. The widget rescales its time axis with τ, so check the milliseconds shown on that axis rather than comparing curve shapes alone.</p><p></p><p>The shape in normalized time remains the same. This separates a response’s exponential shape from its real time duration, and explains why two RC circuits can share the same percentage-at-one-τ rule while changing at different speeds.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Move the characteristic time",
        "prompt": "Set R = 10 kΩ and C = 5 µF. Then double R. Watch τ and the graph’s time labels.",
        "answer": "τ changes from 50 ms to 100 ms",
        "explanation": "The exponential shape in normalized time is unchanged, but the time represented on the axis doubles.",
        "source_ids": [
          "S11",
          "S10"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "rc"
      },
      {
        "title": "Interpret the remaining difference",
        "prompt": "A modeled capacitor reaches 63.2% of its final voltage. About how much of the difference remains?",
        "answer": "36.8%",
        "explanation": "The reached fraction and remaining fraction sum to 100%; the process is not complete.",
        "source_ids": [
          "S11",
          "S10"
        ],
        "kind": "choice",
        "choices": [
          "100%",
          "0%",
          "36.8%",
          "63.2%"
        ],
        "correct": 2,
        "simulator": "none"
      },
      {
        "title": "Choose an honest completion statement",
        "prompt": "At five τ in the explicit ideal charging model, which wording is best?",
        "answer": "Approximately 99.3%, not exactly complete",
        "explanation": "A practical approximation must not be mistaken for a mathematical equality.",
        "source_ids": [
          "S11",
          "S10"
        ],
        "kind": "choice",
        "choices": [
          "The response has no defined final level",
          "Approximately 99.3%, not exactly complete",
          "Exactly complete for every physical capacitor",
          "Only 63.2%"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U11-Q01",
        "type": "choice",
        "prompt": "What is the RC time constant?",
        "explain": "Multiply resistance in ohms by capacitance in farads to obtain seconds.",
        "rubric": "Expected answer: R × C\nReasoning: Multiply resistance in ohms by capacitance in farads to obtain seconds.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "R + C",
          "R × C",
          "R/C",
          "C/R"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U11-Q02",
        "type": "choice",
        "prompt": "10 kΩ multiplied by 5 µF gives…",
        "explain": "10,000 × 5 × 10⁻⁶ = 0.05 s = 50 ms.",
        "rubric": "Expected answer: 50 ms\nReasoning: 10,000 × 5 × 10⁻⁶ = 0.05 s = 50 ms.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "50 ms",
          "50 s",
          "0.05 ms",
          "5 ms"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U11-Q03",
        "type": "choice",
        "prompt": "At fixed C, doubling R makes τ…",
        "explain": "τ is directly proportional to R.",
        "rubric": "Expected answer: Twice as large\nReasoning: τ is directly proportional to R.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "Half as large",
          "Four times as large",
          "Unchanged",
          "Twice as large"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U11-Q04",
        "type": "choice",
        "prompt": "Doubling both R and C makes τ…",
        "explain": "The product receives a factor of 2 × 2 = 4.",
        "rubric": "Expected answer: Four times as large\nReasoning: The product receives a factor of 2 × 2 = 4.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "Half as large",
          "Unchanged",
          "Four times as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U11-Q05",
        "type": "choice",
        "prompt": "At one charging time constant in the accepted ideal example, the level is about…",
        "explain": "The remaining difference is about 36.8%, while the level reached is about 63.2%.",
        "rubric": "Expected answer: 63.2% of the final value\nReasoning: The remaining difference is about 36.8%, while the level reached is about 63.2%.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "0%",
          "63.2% of the final value",
          "100% exactly",
          "36.8% of the final value"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U11-Q06",
        "type": "choice",
        "prompt": "For a 100 V final level, the accepted one-τ charging value is…",
        "explain": "63.2% of 100 V is 63.2 V; this is a mathematical example only.",
        "rubric": "Expected answer: 63.2 V\nReasoning: 63.2% of 100 V is 63.2 V; this is a mathematical example only.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "63.2 V",
          "100 V",
          "36.8 V",
          "1 V"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U11-Q07",
        "type": "choice",
        "prompt": "Does an ideal exponential charging curve reach exactly 100% at five τ?",
        "explain": "The explicit ideal model gives approximately 99.3%, not exact completion.",
        "rubric": "Expected answer: No; it is close but still below the final value\nReasoning: The explicit ideal model gives approximately 99.3%, not exact completion.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "Yes, exactly",
          "Only if the capacitance is an integer",
          "Only if resistance is zero",
          "No; it is close but still below the final value"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U11-Q08",
        "type": "number",
        "prompt": "For 20 kΩ and 2 µF, enter τ in ms.",
        "explain": "20 × 2 = 40 ms after accounting for kilo × micro = milli.",
        "rubric": "Expected answer: 40 ms\nReasoning: 20 × 2 = 40 ms after accounting for kilo × micro = milli.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "answer": 40,
        "unit": "ms",
        "tolerance": 0.4
      },
      {
        "id": "C3-CURATED-U11-Q09",
        "type": "choice",
        "prompt": "At the same elapsed time, a larger τ generally means an ideal charging capacitor has reached…",
        "explain": "A larger time constant means slower progress through the response.",
        "rubric": "Expected answer: A smaller fraction of its final voltage\nReasoning: A larger time constant means slower progress through the response.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "Exactly the final voltage",
          "A negative capacitance",
          "A smaller fraction of its final voltage",
          "A larger fraction"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U11-Q10",
        "type": "choice",
        "prompt": "Why must you inspect the widget’s time-axis labels after changing R or C?",
        "explain": "The normalized curve shape can look similar even when the duration in ms changes.",
        "rubric": "Expected answer: The graph’s displayed time range rescales with τ\nReasoning: The normalized curve shape can look similar even when the duration in ms changes.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "The percentage scale is removed",
          "The graph’s displayed time range rescales with τ",
          "The equation becomes false",
          "The voltage must be physical"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U11-Q11",
        "type": "choice",
        "prompt": "Which source item is intentionally not adopted as verified data?",
        "explain": "The extraction flags disputed graph labels and completion wording separately.",
        "rubric": "Expected answer: The questionable discharge percentage label\nReasoning: The extraction flags disputed graph labels and completion wording separately.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "The questionable discharge percentage label",
          "The accepted RC multiplication",
          "The 10 kΩ and 5 µF values",
          "The one-τ charging example"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U11-Q12",
        "type": "choice",
        "prompt": "What units make R × C produce seconds directly?",
        "explain": "Prefixes can be used only when their combined scale is accounted for.",
        "rubric": "Expected answer: Ohms and farads\nReasoning: Prefixes can be used only when their combined scale is accounted for.",
        "safety": false,
        "source_ids": [
          "S11",
          "S10"
        ],
        "choices": [
          "Kilohms and microfarads without a conversion factor",
          "Ohms and hertz",
          "Volts and amperes",
          "Ohms and farads"
        ],
        "correct": 3
      }
    ],
    "minutes": 40,
    "simulator": "rc",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U11",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 11,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Multiply resistance in ohms by capacitance in farads to obtain seconds.",
      "anchors": [
        [
          "Goal 1",
          "Calculate τ = RC with compatible units"
        ],
        [
          "Goal 2",
          "Interpret the accepted one-time-constant charging point"
        ],
        [
          "Goal 3",
          "Distinguish approaching a final value from exactly reaching it"
        ]
      ],
      "caution": "The source’s 100 V values are paper examples. No high-voltage construction, discharge method or handling procedure is authorized here.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "What is the RC time constant?",
      "outcome": "Calculate RC timing and read ideal exponential behavior without mistaking an approximation for exact completion.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 12,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U12",
    "generated": true,
    "subtrack": "generated",
    "title": "12 · Explore capacitive reactance and lead",
    "description": "Calculate a capacitor’s ideal AC reactance and distinguish its magnitude from its phase relationship.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17, 21",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Reactance is not a resistor value",
        "source_ids": [
          "S13",
          "S2"
        ]
      },
      {
        "heading": "Work through the reciprocal",
        "source_ids": [
          "S13",
          "S2"
        ]
      },
      {
        "heading": "Predict before moving a control",
        "source_ids": [
          "S13",
          "S2"
        ]
      },
      {
        "heading": "Current leads voltage in the capacitor figure",
        "source_ids": [
          "S13",
          "S2"
        ]
      }
    ],
    "objectives": [
      "Use X_C = 1/(2πfC) with SI values",
      "Predict inverse changes with frequency or capacitance",
      "Read current-leading phase without confusing it with polarity"
    ],
    "html": "<p>Calculate a capacitor’s ideal AC reactance and distinguish its magnitude from its phase relationship.</p><h3>Reactance is not a resistor value</h3><p>The capacitor’s ideal capacitive reactance magnitude is X_C = 1/(2πfC), measured in ohms. f is frequency in hertz, C is capacitance in farads, and π is the numerical constant pi.</p><p></p><p>Although X_C shares the ohm unit with resistance, a reactive element’s AC behavior includes phase. Do not treat a reactance label as a statement that the component behaves like an ordinary resistor in every respect.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Work through the reciprocal</h3><p>For a hypothetical f = 1 kHz and C = 1 µF, convert to 1,000 Hz and 1 × 10⁻⁶ F. The denominator is 2π × 1,000 × 10⁻⁶ ≈ 0.006283. Now take its reciprocal: X_C ≈ 159.15 Ω.</p><p></p><p>Stopping at 0.006283 would report the denominator rather than reactance. Enter the entire product inside the denominator, and retain enough precision until the final reciprocal. A calculator’s grouping matters.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Predict before moving a control</h3><p>Frequency and capacitance both appear in the denominator. Doubling either while holding the other fixed halves X_C. Doubling both reduces it to a quarter of its original value.</p><p></p><p>The widget uses frequency in kHz and capacitance in nF, with those prefixes converted internally. Read its units before copying a number. Increase frequency at a fixed capacitance and observe the falling reactance curve; then change capacitance and see the curve shift.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p><h3>Current leads voltage in the capacitor figure</h3><p>The accepted source figure shows capacitor current leading voltage by 90°. A phase lead describes the relative position of repeating waveforms, not a larger amplitude or a physical instruction about which wire carries current first.</p><p></p><p>The figure’s current phasor points right and voltage phasor points down under its chosen reference convention. A downward phasor is not a claim that instantaneous voltage is always negative. Keep phase-reference orientation, instantaneous sign and amplitude as separate ideas.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Trace the inverse-frequency curve",
        "prompt": "Keep capacitance at 100 nF. Compare 1 kHz and 2 kHz, then inspect the reactance curve.",
        "answer": "Reactance halves",
        "explanation": "The frequency factor doubles the denominator. The graph is an ideal relationship, not a measured component trace.",
        "source_ids": [
          "S13",
          "S2"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "xc"
      },
      {
        "title": "Separate phase from size",
        "prompt": "Current leading voltage means what?",
        "answer": "The current waveform is ahead in phase",
        "explanation": "Phase lead describes relative waveform position, independently of amplitude.",
        "source_ids": [
          "S13",
          "S2"
        ],
        "kind": "choice",
        "choices": [
          "Current must have the larger amplitude",
          "Voltage must always be negative",
          "The capacitor has negative resistance",
          "The current waveform is ahead in phase"
        ],
        "correct": 3,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U12-Q01",
        "type": "choice",
        "prompt": "What is the accepted capacitive-reactance formula?",
        "explain": "The entire frequency-capacitance product is in the denominator.",
        "rubric": "Expected answer: X_C = 1/(2πfC)\nReasoning: The entire frequency-capacitance product is in the denominator.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "X_C = 1/(2πfC)",
          "X_C = 2πfC",
          "X_C = C/f",
          "X_C = f/C"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U12-Q02",
        "type": "choice",
        "prompt": "Which unit belongs to X_C?",
        "explain": "Reactance is an opposition-to-AC magnitude expressed in ohms.",
        "rubric": "Expected answer: Ohm\nReasoning: Reactance is an opposition-to-AC magnitude expressed in ohms.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "Farad",
          "Hertz",
          "Joule",
          "Ohm"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U12-Q03",
        "type": "choice",
        "prompt": "At fixed C, doubling frequency makes X_C…",
        "explain": "Frequency occurs in the denominator.",
        "rubric": "Expected answer: Half as large\nReasoning: Frequency occurs in the denominator.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "Four times as large",
          "Unchanged",
          "Half as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U12-Q04",
        "type": "choice",
        "prompt": "At fixed f, doubling capacitance makes X_C…",
        "explain": "Capacitance also occurs in the denominator.",
        "rubric": "Expected answer: Half as large\nReasoning: Capacitance also occurs in the denominator.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "Unchanged",
          "Half as large",
          "Twice as large",
          "Four times as large"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U12-Q05",
        "type": "choice",
        "prompt": "For 1 kHz and 1 µF, X_C is approximately…",
        "explain": "After conversion, take the reciprocal of about 0.006283.",
        "rubric": "Expected answer: 159 Ω\nReasoning: After conversion, take the reciprocal of about 0.006283.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "159 Ω",
          "0.00628 Ω",
          "159,000 Ω",
          "6.28 Ω"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U12-Q06",
        "type": "choice",
        "prompt": "What step is missing if a learner reports the denominator as the answer?",
        "explain": "The equation starts with 1 divided by the product.",
        "rubric": "Expected answer: Taking the reciprocal\nReasoning: The equation starts with 1 divided by the product.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "Squaring the result",
          "Adding resistance automatically",
          "Converting pi to a prefix",
          "Taking the reciprocal"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U12-Q07",
        "type": "choice",
        "prompt": "Doubling both f and C gives what reactance factor?",
        "explain": "The denominator becomes four times as large.",
        "rubric": "Expected answer: One quarter\nReasoning: The denominator becomes four times as large.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "Two",
          "Four",
          "One quarter",
          "One half"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U12-Q08",
        "type": "choice",
        "prompt": "In the accepted capacitor phase figure, which quantity leads?",
        "explain": "The extraction explicitly identifies a 90° current lead for this figure.",
        "rubric": "Expected answer: Current leads voltage\nReasoning: The extraction explicitly identifies a 90° current lead for this figure.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "The figure establishes no phase relation",
          "Current leads voltage",
          "Voltage leads current",
          "Both peak together under every condition"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U12-Q09",
        "type": "choice",
        "prompt": "A downward voltage phasor in the chosen reference means…",
        "explain": "Phasor orientation represents phase under a reference convention.",
        "rubric": "Expected answer: A relative phase orientation\nReasoning: Phasor orientation represents phase under a reference convention.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "choices": [
          "A relative phase orientation",
          "Voltage is always negative",
          "Current always flows down a wire",
          "Capacitance is negative"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U12-Q10",
        "type": "number",
        "prompt": "At 1 kHz and 1 µF, enter X_C in Ω rounded to two decimals.",
        "explain": "1/(2π × 1,000 × 10⁻⁶) ≈ 159.15 Ω.",
        "rubric": "Expected answer: 159.15 Ω\nReasoning: 1/(2π × 1,000 × 10⁻⁶) ≈ 159.15 Ω.",
        "safety": false,
        "source_ids": [
          "S13",
          "S2"
        ],
        "answer": 159.15,
        "unit": "Ω",
        "tolerance": 1.5915000000000001
      }
    ],
    "minutes": 34,
    "simulator": "xc",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U12",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 12,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The entire frequency-capacitance product is in the denominator.",
      "anchors": [
        [
          "Goal 1",
          "Use X_C = 1/(2πfC) with SI values"
        ],
        [
          "Goal 2",
          "Predict inverse changes with frequency or capacitance"
        ],
        [
          "Goal 3",
          "Read current-leading phase without confusing it with polarity"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "What is the accepted capacitive-reactance formula?",
      "outcome": "Calculate a capacitor’s ideal AC reactance and distinguish its magnitude from its phase relationship.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 13,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U13",
    "generated": true,
    "subtrack": "generated",
    "title": "13 · Combine inductors within a clear model",
    "description": "Interpret inductance and simple combinations while keeping magnetic coupling assumptions visible.",
    "module": "Associate CET Study Guide",
    "sourcePages": "22",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Inductance describes opposition to changing current",
        "source_ids": [
          "S14",
          "S15"
        ]
      },
      {
        "heading": "A simple series example",
        "source_ids": [
          "S14",
          "S15"
        ]
      },
      {
        "heading": "A simple parallel example",
        "source_ids": [
          "S14",
          "S15"
        ]
      },
      {
        "heading": "Know where the source is incomplete",
        "source_ids": [
          "S14",
          "S15"
        ]
      }
    ],
    "objectives": [
      "Read inductance values in H and mH",
      "Apply simple uncoupled combination arithmetic",
      "Recognize where coupling makes the simple model insufficient"
    ],
    "html": "<p>Interpret inductance and simple combinations while keeping magnetic coupling assumptions visible.</p><h3>Inductance describes opposition to changing current</h3><p>The chapter identifies inductance as a property opposing changes in current, measured in henrys. L commonly names the inductance. A value of 10 mH is 0.01 H because milli means 10⁻³.</p><p></p><p>This description is about current changes. It is not interchangeable with a resistor’s resistance or a capacitor’s capacitance. We keep the property definition separate from the AC reactance calculation introduced in the next lesson.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p><h3>A simple series example</h3><p>The accepted simple example combines three 4 mH inductors to obtain 12 mH in series. In the explicitly uncoupled widget model, series inductances add just as positive resistances do: L_T = L₁ + L₂.</p><p></p><p>For hypothetical 10 mH and 20 mH uncoupled inductors, the series total is 30 mH. The adjective uncoupled is part of the model. You cannot silently discard magnetic interaction for real coils that influence one another.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p><h3>A simple parallel example</h3><p>The source’s simple equal-value example gives approximately 1.3 mH for three 4 mH inductors in parallel. An equal uncoupled model gives 4/3 ≈ 1.333 mH. The widget uses reciprocal combinations for its explicitly uncoupled two-inductor comparison.</p><p></p><p>For 10 and 20 mH in that model, the parallel equivalent is 10 × 20/(10 + 20) ≈ 6.67 mH. These computations illustrate the limited arithmetic model, not a universal formula for magnetically coupled coils.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p><h3>Know where the source is incomplete</h3><p>The saved extraction notes that reinforcing or opposing magnetic fields affect a mutual-inductance adjustment. It also flags incomplete coupling assumptions and cropped wording in the parallel discussion. We do not reconstruct missing text or infer a general coupled-inductor formula.</p><p></p><p>Before using simple addition or reciprocals in a real design, establish whether the uncoupled assumptions apply. For this lesson, the simulator clearly states its assumptions and lets you practice units and arithmetic without pretending that the missing source qualifications have been resolved.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Explore the uncoupled comparison",
        "prompt": "Set L₁ = 10 mH and L₂ = 20 mH. Compare the two arrangements, keeping the widget’s uncoupled assumption in view.",
        "answer": "Series is 30 mH; parallel is about 6.67 mH",
        "explanation": "The model excludes mutual magnetic coupling and does not certify a physical coil arrangement.",
        "source_ids": [
          "S14",
          "S15"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "inductors"
      },
      {
        "title": "Check the model before arithmetic",
        "prompt": "Two nearby coils influence each other magnetically. What should you establish before applying the widget’s simple rule?",
        "answer": "Whether its uncoupled assumption is valid",
        "explanation": "Magnetic interaction can change the applicable model; simple arithmetic alone cannot establish the right assumptions.",
        "source_ids": [
          "S14",
          "S15"
        ],
        "kind": "choice",
        "choices": [
          "That the calculator has four digits",
          "That both values are written in capitals",
          "That the total must equal their product",
          "Whether its uncoupled assumption is valid"
        ],
        "correct": 3,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U13-Q01",
        "type": "choice",
        "prompt": "Inductance is measured in…",
        "explain": "The accepted property definition uses the henry.",
        "rubric": "Expected answer: Henrys\nReasoning: The accepted property definition uses the henry.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "Watts",
          "Coulombs",
          "Henrys",
          "Farads"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U13-Q02",
        "type": "choice",
        "prompt": "Convert 10 mH to H.",
        "explain": "Milli contributes a factor of 10⁻³.",
        "rubric": "Expected answer: 0.01 H\nReasoning: Milli contributes a factor of 10⁻³.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "10 H",
          "0.01 H",
          "10,000 H",
          "0.1 H"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U13-Q03",
        "type": "choice",
        "prompt": "The source’s simple three-4-mH series example gives…",
        "explain": "The accepted simple example adds three 4 mH values.",
        "rubric": "Expected answer: 12 mH\nReasoning: The accepted simple example adds three 4 mH values.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "12 mH",
          "1.33 mH",
          "4 mH",
          "64 mH"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U13-Q04",
        "type": "choice",
        "prompt": "In the explicitly uncoupled model, 10 and 20 mH in parallel give about…",
        "explain": "Product-over-sum gives 200/30 mH in this limited model.",
        "rubric": "Expected answer: 6.67 mH\nReasoning: Product-over-sum gives 200/30 mH in this limited model.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "30 mH",
          "15 mH",
          "200 mH",
          "6.67 mH"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U13-Q05",
        "type": "choice",
        "prompt": "Which assumption belongs to the widget’s simple combination rules?",
        "explain": "The modeled arithmetic is explicitly limited to uncoupled ideal inductors.",
        "rubric": "Expected answer: Negligible mutual magnetic coupling\nReasoning: The modeled arithmetic is explicitly limited to uncoupled ideal inductors.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "Inductance is negative",
          "Frequency is a unit of inductance",
          "Negligible mutual magnetic coupling",
          "Every physical coil has identical coupling"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U13-Q06",
        "type": "choice",
        "prompt": "Why is a general coupled-inductor formula not taught from the cropped paragraph?",
        "explain": "Unseen or incompletely specified source material is not evidence for a general rule.",
        "rubric": "Expected answer: The needed source qualifications are incomplete\nReasoning: Unseen or incompletely specified source material is not evidence for a general rule.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "The units table proves the formula",
          "The needed source qualifications are incomplete",
          "Coupling never changes anything",
          "Cropped words can be guessed safely"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U13-Q07",
        "type": "number",
        "prompt": "In the simple uncoupled series model, enter 8 mH + 12 mH in mH.",
        "explain": "Under the stated model, direct addition gives 20 mH.",
        "rubric": "Expected answer: 20 mH\nReasoning: Under the stated model, direct addition gives 20 mH.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "answer": 20,
        "unit": "mH",
        "tolerance": 0.2
      },
      {
        "id": "C3-CURATED-U13-Q08",
        "type": "choice",
        "prompt": "Which statement preserves the source’s uncertainty?",
        "explain": "The accepted simple examples and the unresolved coupling discussion are kept distinct.",
        "rubric": "Expected answer: The simple examples do not establish a universal parallel rule for coupled coils\nReasoning: The accepted simple examples and the unresolved coupling discussion are kept distinct.",
        "safety": false,
        "source_ids": [
          "S14",
          "S15"
        ],
        "choices": [
          "The simple examples do not establish a universal parallel rule for coupled coils",
          "All coupled coils use the same reciprocal shortcut",
          "The cropped paragraph has been fully read",
          "Mutual inductance is always zero"
        ],
        "correct": 0
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U13",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 13,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The accepted property definition uses the henry.",
      "anchors": [
        [
          "Goal 1",
          "Read inductance values in H and mH"
        ],
        [
          "Goal 2",
          "Apply simple uncoupled combination arithmetic"
        ],
        [
          "Goal 3",
          "Recognize where coupling makes the simple model insufficient"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Inductance is measured in…",
      "outcome": "Interpret inductance and simple combinations while keeping magnetic coupling assumptions visible.",
      "missionType": "units"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 14,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U14",
    "generated": true,
    "subtrack": "generated",
    "title": "14 · Compare inductive and capacitive frequency response",
    "description": "Calculate inductive reactance and predict why its frequency trend is opposite to capacitive reactance.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Read the inductive-reactance equation",
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "heading": "Work a complete numerical example",
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "heading": "Predict proportional changes",
        "source_ids": [
          "S14",
          "S13"
        ]
      },
      {
        "heading": "Separate lead from magnitude",
        "source_ids": [
          "S14",
          "S13"
        ]
      }
    ],
    "objectives": [
      "Use X_L = 2πfL with compatible units",
      "Predict direct changes with frequency and inductance",
      "Keep the qualitative phase lead distinct from reactance magnitude"
    ],
    "html": "<p>Calculate inductive reactance and predict why its frequency trend is opposite to capacitive reactance.</p><h3>Read the inductive-reactance equation</h3><p>The accepted relationship is X_L = 2πfL. X_L is inductive reactance magnitude in ohms, f is frequency in hertz and L is inductance in henrys. Unlike the capacitor equation, the frequency-inductance product is not inside a reciprocal.</p><p></p><p>This difference determines the trend: higher frequency gives larger inductive reactance, while higher frequency gives smaller capacitive reactance at fixed capacitance.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Work a complete numerical example</h3><p>For hypothetical f = 1 kHz and L = 10 mH, use 1,000 Hz and 0.01 H. Then X_L = 2π × 1,000 × 0.01 = 20π Ω ≈ 62.83 Ω.</p><p></p><p>The prefixes cancel numerically when multiplying kHz by mH, because 10³ × 10⁻³ = 1. That does not mean prefixes can always be ignored; it means this particular compatible product has a net scale factor of one. State that reason if you use the shortcut.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Predict proportional changes</h3><p>Doubling frequency at fixed L doubles X_L. Doubling L at fixed frequency also doubles X_L. Doubling both multiplies reactance by four. Compare those predictions with the rising widget curve.</p><p></p><p>For a capacitor, doubling frequency halves X_C instead. The two trends matter when both components appear in a series circuit. Do not subtract their values before checking that they describe the same frequency and are expressed in compatible units.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p><h3>Separate lead from magnitude</h3><p>The source extraction establishes that voltage leads current in its inductive-reactance discussion. It does not supply a numerical inductive phase angle as accepted evidence, so this lesson keeps the relationship qualitative rather than adding a source-attributed angle.</p><p></p><p>A statement about which waveform leads does not tell you the total phase of a circuit containing resistance and other reactances. A component’s reactance magnitude, a component phase relationship and complete-circuit impedance are related but separate ideas.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Trace the rising frequency curve",
        "prompt": "Keep L = 10 mH. Compare 1 and 2 kHz, then raise inductance at fixed frequency.",
        "answer": "Doubling either factor doubles X_L",
        "explanation": "The plot and calculated value follow the direct product 2πfL.",
        "source_ids": [
          "S14",
          "S13"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "xl"
      },
      {
        "title": "Compare the opposite trend",
        "prompt": "In this separate capacitor widget, hold C = 100 nF and increase frequency from 1 to 2 kHz.",
        "answer": "X_C halves rather than doubles",
        "explanation": "The comparison isolates the opposite frequency trends of ideal inductive and capacitive reactance.",
        "source_ids": [
          "S14",
          "S13"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "xc"
      },
      {
        "title": "Choose the right trend",
        "prompt": "Which component’s ideal reactance grows when frequency grows at fixed component value?",
        "answer": "Inductor",
        "explanation": "X_L = 2πfL grows with f, whereas X_C = 1/(2πfC) decreases.",
        "source_ids": [
          "S14",
          "S13"
        ],
        "kind": "choice",
        "choices": [
          "Neither depends on frequency",
          "Inductor",
          "Capacitor",
          "Both decrease"
        ],
        "correct": 1,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U14-Q01",
        "type": "choice",
        "prompt": "Which equation gives ideal inductive reactance magnitude?",
        "explain": "Inductive reactance uses a direct frequency-inductance product.",
        "rubric": "Expected answer: X_L = 2πfL\nReasoning: Inductive reactance uses a direct frequency-inductance product.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "X_L = L/f",
          "X_L = f/L",
          "X_L = 2πfL",
          "X_L = 1/(2πfL)"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U14-Q02",
        "type": "choice",
        "prompt": "What unit is used for L in the base-unit calculation?",
        "explain": "Inductance is expressed in henrys.",
        "rubric": "Expected answer: Henry\nReasoning: Inductance is expressed in henrys.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "Ohm",
          "Henry",
          "Farad",
          "Hertz"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U14-Q03",
        "type": "choice",
        "prompt": "For 1 kHz and 10 mH, X_L is approximately…",
        "explain": "2π × 1,000 × 0.01 = 20π Ω.",
        "rubric": "Expected answer: 62.83 Ω\nReasoning: 2π × 1,000 × 0.01 = 20π Ω.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "62.83 Ω",
          "0.06283 Ω",
          "6,283 Ω",
          "159.15 Ω"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U14-Q04",
        "type": "choice",
        "prompt": "At fixed L, doubling frequency makes X_L…",
        "explain": "Frequency appears to the first power in the product.",
        "rubric": "Expected answer: Twice as large\nReasoning: Frequency appears to the first power in the product.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "Half as large",
          "Unchanged",
          "Zero",
          "Twice as large"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U14-Q05",
        "type": "choice",
        "prompt": "Doubling both f and L makes X_L…",
        "explain": "The two factors each double, giving 2 × 2 = 4.",
        "rubric": "Expected answer: Four times as large\nReasoning: The two factors each double, giving 2 × 2 = 4.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "One quarter",
          "Unchanged",
          "Four times as large",
          "Twice as large"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U14-Q06",
        "type": "choice",
        "prompt": "At fixed component values, what does increasing frequency do?",
        "explain": "The inductor uses a product; the capacitor uses a reciprocal.",
        "rubric": "Expected answer: X_L rises while X_C falls\nReasoning: The inductor uses a product; the capacitor uses a reciprocal.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "Both stay fixed",
          "X_L rises while X_C falls",
          "Both rise",
          "Both fall"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U14-Q07",
        "type": "choice",
        "prompt": "Why can kHz times mH be used numerically in this formula?",
        "explain": "10³ × 10⁻³ = 1, after explicitly accounting for the scales.",
        "rubric": "Expected answer: The kilo and milli factors multiply to one\nReasoning: 10³ × 10⁻³ = 1, after explicitly accounting for the scales.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "The kilo and milli factors multiply to one",
          "Every prefix may be omitted",
          "Both units become watts",
          "The formula contains a reciprocal"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U14-Q08",
        "type": "choice",
        "prompt": "Which phase relation is accepted qualitatively for the inductor discussion?",
        "explain": "The extraction supports a qualitative voltage lead; no additional numerical angle is attributed here.",
        "rubric": "Expected answer: Voltage leads current\nReasoning: The extraction supports a qualitative voltage lead; no additional numerical angle is attributed here.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "Current leads voltage",
          "Phase means a larger amplitude only",
          "The source establishes equal instantaneous values at all times",
          "Voltage leads current"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U14-Q09",
        "type": "number",
        "prompt": "At 2 kHz and 10 mH, enter X_L in Ω rounded to two decimals.",
        "explain": "2π × 2,000 × 0.01 ≈ 125.66 Ω.",
        "rubric": "Expected answer: 125.66 Ω\nReasoning: 2π × 2,000 × 0.01 ≈ 125.66 Ω.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "answer": 125.66,
        "unit": "Ω",
        "tolerance": 1.2566
      },
      {
        "id": "C3-CURATED-U14-Q10",
        "type": "choice",
        "prompt": "Does an inductor’s reactance alone define the total phase of every RLC circuit?",
        "explain": "Other components and their arrangement affect complete-circuit impedance and phase.",
        "rubric": "Expected answer: No; the complete circuit must be considered\nReasoning: Other components and their arrangement affect complete-circuit impedance and phase.",
        "safety": false,
        "source_ids": [
          "S14",
          "S13"
        ],
        "choices": [
          "Only if the unit is capitalized",
          "Only if current is positive",
          "No; the complete circuit must be considered",
          "Yes, in every topology"
        ],
        "correct": 2
      }
    ],
    "minutes": 34,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U14",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 14,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "Inductive reactance uses a direct frequency-inductance product.",
      "anchors": [
        [
          "Goal 1",
          "Use X_L = 2πfL with compatible units"
        ],
        [
          "Goal 2",
          "Predict direct changes with frequency and inductance"
        ],
        [
          "Goal 3",
          "Keep the qualitative phase lead distinct from reactance magnitude"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "Which equation gives ideal inductive reactance magnitude?",
      "outcome": "Calculate inductive reactance and predict why its frequency trend is opposite to capacitive reactance.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 15,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U15",
    "generated": true,
    "subtrack": "generated",
    "title": "15 · Combine a series circuit’s resistance and reactance",
    "description": "Use a defined signed reactive difference and a nonnegative magnitude, without extending a series formula to unrelated parallel networks.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22, 23",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Define the reactive difference before squaring",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Work the accepted 3–4–5 example",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "The square does not make the physical interpretation disappear",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Use the widget’s quantities correctly",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Respect topology and source limits",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ]
      }
    ],
    "objectives": [
      "Identify inductive versus capacitive predominance",
      "Calculate series impedance magnitude",
      "Keep a magnitude separate from a signed reactive difference"
    ],
    "html": "<p>Use a defined signed reactive difference and a nonnegative magnitude, without extending a series formula to unrelated parallel networks.</p><h3>Define the reactive difference before squaring</h3><p>For this series model, define X_net = X_L − X_C. A positive difference is inductive and a negative one is capacitive. The magnitude relationship is |Z| = √(R² + X_net²).</p><p></p><p>The printed source example writes the difference in the opposite order before squaring. Either order gives the same magnitude because the square removes the sign, but it does not mean the sign is irrelevant to interpreting predominance. We state our convention explicitly.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Work the accepted 3–4–5 example</h3><p>The source gives R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω. Our signed difference is 16 − 20 = −4 Ω, so the circuit is predominantly capacitive. The magnitude is √(3² + (−4)²) = √(9 + 16) = √25 = 5 Ω.</p><p></p><p>Do not add 3 + 16 + 20 to obtain 39 Ω. Reactive contributions oppose one another here, and resistance combines with the net reactive contribution through the magnitude relation rather than direct arithmetic addition.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>The square does not make the physical interpretation disappear</h3><p>A magnitude cannot be negative. A net reactance of −4 Ω and one of +4 Ω at the same R give the same numerical magnitude, but different predominance. If X_L = X_C, the net reactive difference is zero and the magnitude equals R in this ideal series model.</p><p></p><p>The accepted source phasor sketch labels its example capacitive. We do not add an unsupported total circuit phase angle or use the magnitude formula to claim the current is leading by a particular numerical angle.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Use the widget’s quantities correctly</h3><p>The simulator takes frequency, L, C and R, then calculates X_L, X_C and |Z|. It is not asking you to enter reactance values into an inductance or capacitance field. Watch the units and distinguish the inputs from the derived outputs.</p><p></p><p>With frequency, L and R fixed, increasing C lowers X_C. The complete impedance may decrease toward cancellation and then increase beyond it; do not claim that every capacitance increase always lowers |Z|. Compare the changing difference, not just one component in isolation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Respect topology and source limits</h3><p>This formula is for the stated ideal series RLC model. The extraction flags ambiguous parallel-impedance wording and does not support generalizing that expression to arbitrary parallel RLC networks. Those details are not reconstructed here.</p><p></p><p>A reliable answer names the arrangement, keeps all reactance values at the same frequency, defines its signed difference, performs the square and square root carefully, and reports a nonnegative magnitude with the ohm unit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Watch reactive cancellation",
        "prompt": "Hold frequency, L and R fixed while changing C. Compare X_L, X_C and |Z| rather than assuming a permanent trend.",
        "answer": "The magnitude follows the size of the net reactive difference",
        "explanation": "Resistance and reactive difference combine by the square-root relation in this series model.",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "rlc"
      },
      {
        "title": "Preserve the sign information",
        "prompt": "Which label belongs to X_L = 16 Ω and X_C = 20 Ω under X_net = X_L − X_C?",
        "answer": "Capacitive predominance with X_net = −4 Ω",
        "explanation": "The sign identifies predominance; the magnitude calculation then squares the difference.",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "kind": "choice",
        "choices": [
          "No reactive contribution",
          "Capacitive predominance with X_net = −4 Ω",
          "Inductive predominance with X_net = −4 Ω",
          "Negative impedance magnitude"
        ],
        "correct": 1,
        "simulator": "none"
      },
      {
        "title": "Choose the magnitude route",
        "prompt": "After obtaining 9 + 16 = 25 Ω² in the source example, what comes next?",
        "answer": "√25 = 5 Ω",
        "explanation": "The square root restores the ohm unit and gives the magnitude.",
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "kind": "choice",
        "choices": [
          "√25 = 5 Ω",
          "25 Ω is already the impedance",
          "1/25 Ω",
          "25 + 20 Ω"
        ],
        "correct": 0,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U15-Q01",
        "type": "choice",
        "prompt": "For R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω, our X_net is…",
        "explain": "The stated convention is X_L − X_C = 16 − 20.",
        "rubric": "Expected answer: −4 Ω\nReasoning: The stated convention is X_L − X_C = 16 − 20.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "−4 Ω",
          "+4 Ω",
          "36 Ω",
          "39 Ω"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U15-Q02",
        "type": "choice",
        "prompt": "That signed difference indicates which predominance?",
        "explain": "Capacitive reactance magnitude is larger in the accepted source example.",
        "rubric": "Expected answer: Capacitive\nReasoning: Capacitive reactance magnitude is larger in the accepted source example.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Inductive",
          "Purely resistive despite unequal reactances",
          "A negative resistance",
          "Capacitive"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U15-Q03",
        "type": "choice",
        "prompt": "What is the impedance magnitude of the accepted example?",
        "explain": "√(3² + (−4)²) = √25 = 5 Ω.",
        "rubric": "Expected answer: 5 Ω\nReasoning: √(3² + (−4)²) = √25 = 5 Ω.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "−5 Ω",
          "4 Ω",
          "5 Ω",
          "39 Ω"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U15-Q04",
        "type": "choice",
        "prompt": "What operation is required after adding the two squared terms?",
        "explain": "The formula is a square root of the sum, not the sum itself.",
        "rubric": "Expected answer: Take the square root\nReasoning: The formula is a square root of the sum, not the sum itself.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Keep the result in squared ohms",
          "Take the square root",
          "Take the reciprocal automatically",
          "Add X_L again"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U15-Q05",
        "type": "choice",
        "prompt": "Why do +4 Ω and −4 Ω give the same magnitude term when squared?",
        "explain": "The magnitude calculation loses sign, while the separately defined sign retains interpretation.",
        "rubric": "Expected answer: Both squares are 16 Ω²\nReasoning: The magnitude calculation loses sign, while the separately defined sign retains interpretation.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Both squares are 16 Ω²",
          "Their predominance is identical",
          "Both are zero",
          "Resistance disappears"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U15-Q06",
        "type": "choice",
        "prompt": "If X_L = X_C in this ideal series model, |Z| equals…",
        "explain": "The net reactive difference becomes zero.",
        "rubric": "Expected answer: R\nReasoning: The net reactive difference becomes zero.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Zero for every R",
          "X_L + X_C",
          "R² without a square root",
          "R"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U15-Q07",
        "type": "choice",
        "prompt": "Can this series relation be applied to any arbitrary parallel RLC network?",
        "explain": "The accepted evidence supports a series model, not a universal parallel formula.",
        "rubric": "Expected answer: No; topology and the appropriate model matter\nReasoning: The accepted evidence supports a series model, not a universal parallel formula.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Only if the values are rounded",
          "Only if all prefixes are milli",
          "No; topology and the appropriate model matter",
          "Yes, always"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U15-Q08",
        "type": "number",
        "prompt": "For R = 6 Ω and a net reactance magnitude of 8 Ω, enter |Z| in Ω.",
        "explain": "√(6² + 8²) = √100 = 10 Ω.",
        "rubric": "Expected answer: 10 Ω\nReasoning: √(6² + 8²) = √100 = 10 Ω.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "answer": 10,
        "unit": "Ω",
        "tolerance": 0.1
      },
      {
        "id": "C3-CURATED-U15-Q09",
        "type": "choice",
        "prompt": "The widget’s L field expects…",
        "explain": "The simulator derives reactance from frequency and component values.",
        "rubric": "Expected answer: Inductance in its labeled unit\nReasoning: The simulator derives reactance from frequency and component values.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "A phase angle",
          "Inductance in its labeled unit",
          "A reactance value in ohms",
          "Impedance magnitude"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U15-Q10",
        "type": "choice",
        "prompt": "Which statement about increasing C is safe for the whole series circuit?",
        "explain": "X_C falls, but the net reactive difference may pass through zero and grow again.",
        "rubric": "Expected answer: Watch cancellation; |Z| need not decrease for every increase\nReasoning: X_C falls, but the net reactive difference may pass through zero and grow again.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Watch cancellation; |Z| need not decrease for every increase",
          "It always doubles |Z|",
          "It always lowers |Z| without limit",
          "It cannot affect X_C"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U15-Q11",
        "type": "choice",
        "prompt": "What is wrong with reporting an impedance magnitude of −5 Ω?",
        "explain": "The signed reactive difference and nonnegative magnitude have different roles.",
        "rubric": "Expected answer: A magnitude must be nonnegative\nReasoning: The signed reactive difference and nonnegative magnitude have different roles.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Its unit must be hertz",
          "Every capacitance is negative",
          "The source allows negative magnitudes",
          "A magnitude must be nonnegative"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U15-Q12",
        "type": "choice",
        "prompt": "What should be shared when comparing X_L and X_C in one circuit calculation?",
        "explain": "Both reactances describe the same operating condition in this model.",
        "rubric": "Expected answer: The operating frequency and compatible units\nReasoning: Both reactances describe the same operating condition in this model.",
        "safety": false,
        "source_ids": [
          "S16",
          "S13",
          "S14"
        ],
        "choices": [
          "Only the number of decimal digits",
          "No common conditions are needed",
          "The operating frequency and compatible units",
          "Only their written letter size"
        ],
        "correct": 2
      }
    ],
    "minutes": 40,
    "simulator": null,
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U15",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 15,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The stated convention is X_L − X_C = 16 − 20.",
      "anchors": [
        [
          "Goal 1",
          "Identify inductive versus capacitive predominance"
        ],
        [
          "Goal 2",
          "Calculate series impedance magnitude"
        ],
        [
          "Goal 3",
          "Keep a magnitude separate from a signed reactive difference"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "For R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω, our X_net is…",
      "outcome": "Use a defined signed reactive difference and a nonnegative magnitude, without extending a series formula to unrelated parallel networks.",
      "missionType": "circuit"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": false,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 16,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-U16",
    "generated": true,
    "subtrack": "generated",
    "title": "16 · Find and check a resonant frequency",
    "description": "Calculate ideal LC resonance and verify it by comparing inductive and capacitive reactance at the same frequency.",
    "module": "Associate CET Study Guide",
    "sourcePages": "21, 22, 23, 24",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Resonance starts with a matching condition",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Keep both prefixes visible",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Finish the calculation before rounding",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Check the condition using a second route",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      },
      {
        "heading": "Predict a component change",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ]
      }
    ],
    "objectives": [
      "Convert µH and pF before multiplying",
      "Use f_r = 1/(2π√(LC))",
      "Check resonance by matching reactance magnitudes"
    ],
    "html": "<p>Calculate ideal LC resonance and verify it by comparing inductive and capacitive reactance at the same frequency.</p><h3>Resonance starts with a matching condition</h3><p>The accepted chapter relationship sets X_L = X_C. Substituting their formulas gives 2πfL = 1/(2πfC). Solving that relation gives f_r = 1/(2π√(LC)), with L in henrys, C in farads and frequency in hertz.</p><p></p><p>This lesson uses the source’s explicitly series example and the ideal model. It does not adopt the source’s ambiguous maximum-current wording as a general statement about every series and parallel resonant circuit.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Keep both prefixes visible</h3><p>The source example uses 200 µH and 200 pF. Convert them independently: 200 µH = 2 × 10⁻⁴ H and 200 pF = 2 × 10⁻¹⁰ F. Their product is 4 × 10⁻¹⁴ H·F.</p><p></p><p>Taking the square root gives 2 × 10⁻⁷ s. The exponent is halved under the square root; the leading 4 becomes 2. Confusing pico with micro changes the capacitance by a millionfold factor, and the square root turns that into a thousandfold frequency error.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Finish the calculation before rounding</h3><p>The denominator is 2π × 2 × 10⁻⁷ s ≈ 1.256637 × 10⁻⁶ s. Its reciprocal is approximately 795,775 Hz, or 795.8 kHz. The source reports approximately 795 kHz; we distinguish that display from our more precise independent recalculation.</p><p></p><p>Keep the whole LC product inside the square root, and the whole 2π√(LC) product inside the reciprocal. Leaving out either the square root or reciprocal produces a very different kind of calculation.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Check the condition using a second route</h3><p>At about 795.8 kHz with those component values, X_L = 2πfL is about 1,000 Ω. Calculating X_C = 1/(2πfC) gives about the same 1,000 Ω. Agreement checks the resonance calculation using the underlying condition.</p><p></p><p>In the ideal series RLC model, cancellation of equal reactance magnitudes leaves the resistance in the impedance magnitude. It does not imply every real resonant circuit has zero impedance, or that component tolerances and losses disappear.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p><h3>Predict a component change</h3><p>Because frequency is inversely proportional to √(LC), quadrupling C while holding L fixed halves f_r. Doubling C reduces f_r by a factor of √2, not by a factor of two. The same statements apply to changing L while holding C fixed.</p><p></p><p>Use the resonance widget to test the difference between a twofold and fourfold change. Read the component units before comparing examples. The goal is to combine prefix handling, square roots, reciprocals and a physical condition into one dependable chain of reasoning.</p><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.)</p>",
    "experiment": "generated",
    "activities": [
      {
        "title": "Compare square-root scaling",
        "prompt": "Keep L = 200 µH. Compare C = 200 pF and C = 800 pF, which is four times as large.",
        "answer": "Frequency halves from about 795.8 kHz to 397.9 kHz",
        "explanation": "The capacitance multiplier of four becomes a denominator multiplier of two under the square root.",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "kind": "simulation",
        "choices": [],
        "correct": -1,
        "simulator": "resonance"
      },
      {
        "title": "Choose the independent check",
        "prompt": "You have a proposed resonant frequency. What should you compare at that same frequency?",
        "answer": "Inductive and capacitive reactance magnitudes",
        "explanation": "Using the same frequency and proper units should make X_L and X_C approximately equal.",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "kind": "choice",
        "choices": [
          "Only the number of decimal places",
          "Inductive and capacitive reactance magnitudes",
          "Capacitance in pF and inductance in µH as bare numbers",
          "Only the supply voltage"
        ],
        "correct": 1,
        "simulator": "none"
      },
      {
        "title": "Diagnose a prefix error",
        "prompt": "A learner substitutes 200 µF where the source gives 200 pF. What changed?",
        "answer": "The represented capacitance became one million times larger",
        "explanation": "Micro and pico differ by six powers of ten; the resulting frequency would be a thousand times smaller in the ideal formula.",
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "kind": "choice",
        "choices": [
          "The represented capacitance became one million times larger",
          "The units remained equivalent",
          "Only a letter style changed",
          "Inductance doubled"
        ],
        "correct": 0,
        "simulator": "none"
      }
    ],
    "questions": [
      {
        "id": "C3-CURATED-U16-Q01",
        "type": "choice",
        "prompt": "What equality identifies the accepted ideal resonance condition?",
        "explain": "The inductive and capacitive reactance magnitudes match.",
        "rubric": "Expected answer: X_L = X_C\nReasoning: The inductive and capacitive reactance magnitudes match.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "R = 0 in every circuit",
          "L = C numerically",
          "V = I numerically",
          "X_L = X_C"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U16-Q02",
        "type": "choice",
        "prompt": "What is the accepted resonance-frequency formula?",
        "explain": "The complete LC product is under a square root, and the resulting denominator is inverted.",
        "rubric": "Expected answer: 1/(2π√(LC))\nReasoning: The complete LC product is under a square root, and the resulting denominator is inverted.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "1/(LC)",
          "√(L/C)",
          "1/(2π√(LC))",
          "2πLC"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U16-Q03",
        "type": "choice",
        "prompt": "Convert 200 pF to F.",
        "explain": "Pico means 10⁻¹²: 200 × 10⁻¹² = 2 × 10⁻¹⁰.",
        "rubric": "Expected answer: 2 × 10⁻¹⁰ F\nReasoning: Pico means 10⁻¹²: 200 × 10⁻¹² = 2 × 10⁻¹⁰.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "200 F",
          "2 × 10⁻¹⁰ F",
          "2 × 10⁻⁴ F",
          "2 × 10⁻⁶ F"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U16-Q04",
        "type": "choice",
        "prompt": "What is the product of 2 × 10⁻⁴ H and 2 × 10⁻¹⁰ F?",
        "explain": "Multiply the leading numbers and add exponents.",
        "rubric": "Expected answer: 4 × 10⁻¹⁴ H·F\nReasoning: Multiply the leading numbers and add exponents.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "4 × 10⁻¹⁴ H·F",
          "4 × 10⁻⁴⁰ H·F",
          "4 × 10⁻⁶ H·F",
          "2 × 10⁻¹⁴ H·F"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U16-Q05",
        "type": "choice",
        "prompt": "What is √(4 × 10⁻¹⁴)?",
        "explain": "The square root of 4 is 2 and half of −14 is −7.",
        "rubric": "Expected answer: 2 × 10⁻⁷\nReasoning: The square root of 4 is 2 and half of −14 is −7.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "2 × 10⁻¹⁴",
          "4 × 10⁻⁷",
          "2 × 10⁻²⁸",
          "2 × 10⁻⁷"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U16-Q06",
        "type": "choice",
        "prompt": "The independently recalculated frequency for 200 µH and 200 pF is near…",
        "explain": "The complete reciprocal is about 795,775 Hz, converted to kHz.",
        "rubric": "Expected answer: 795.8 kHz\nReasoning: The complete reciprocal is about 795,775 Hz, converted to kHz.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "0.7958 Hz",
          "7.958 MHz",
          "795.8 kHz",
          "795.8 Hz"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-U16-Q07",
        "type": "choice",
        "prompt": "At fixed L, quadrupling C makes resonant frequency…",
        "explain": "√4 = 2 appears in the denominator.",
        "rubric": "Expected answer: Half as large\nReasoning: √4 = 2 appears in the denominator.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "Unchanged",
          "Half as large",
          "One quarter",
          "Twice as large"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-U16-Q08",
        "type": "choice",
        "prompt": "At fixed L, doubling C makes resonant frequency…",
        "explain": "The square root makes the scaling different from a simple inverse-C relationship.",
        "rubric": "Expected answer: Smaller by a factor of √2\nReasoning: The square root makes the scaling different from a simple inverse-C relationship.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "Smaller by a factor of √2",
          "Half as large exactly",
          "Twice as large",
          "Unchanged"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-U16-Q09",
        "type": "choice",
        "prompt": "Which independent check supports the resonance answer?",
        "explain": "The check returns to the accepted matching condition.",
        "rubric": "Expected answer: Calculate X_L and X_C at the proposed f and compare them\nReasoning: The check returns to the accepted matching condition.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "Check whether L and C have the same bare number",
          "Ignore all prefixes",
          "Set every resistance to zero without qualification",
          "Calculate X_L and X_C at the proposed f and compare them"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-U16-Q10",
        "type": "choice",
        "prompt": "What is intentionally not generalized from the ambiguous source prose?",
        "explain": "Series and parallel conditions must not be collapsed into one unsupported blanket claim.",
        "rubric": "Expected answer: A maximum-current claim for every resonant topology\nReasoning: Series and parallel conditions must not be collapsed into one unsupported blanket claim.",
        "safety": false,
        "source_ids": [
          "S17",
          "S13",
          "S14"
        ],
        "choices": [
          "The need for compatible units",
          "The equality of ideal reactance magnitudes",
          "A maximum-current claim for every resonant topology",
          "The accepted frequency formula"
        ],
        "correct": 2
      }
    ],
    "minutes": 40,
    "simulator": "resonance",
    "kind": "math",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-U16",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 16,
    "overview": {
      "hint": "A problem to investigate",
      "reveal": "The inductive and capacitive reactance magnitudes match.",
      "anchors": [
        [
          "Goal 1",
          "Convert µH and pF before multiplying"
        ],
        [
          "Goal 2",
          "Use f_r = 1/(2π√(LC))"
        ],
        [
          "Goal 3",
          "Check resonance by matching reactance magnitudes"
        ]
      ],
      "caution": "These are paper calculations and idealized simulations, not instructions to build or energize a circuit.",
      "eyebrow": "CHAPTER 3 · GUIDED MATHEMATICS",
      "mission": "What equality identifies the accepted ideal resonance condition?",
      "outcome": "Calculate ideal LC resonance and verify it by comparing inductive and capacitive reactance at the same frequency.",
      "missionType": "wave"
    },
    "sourceTrack": "guide",
    "libraryView": "ceta"
  },
  {
    "chapterSummary": true,
    "curriculum": {
      "section": "exam",
      "source_id": "associate-cet",
      "source_title": "Associate CET Study Guide",
      "chapter_id": "3",
      "chapter_title": "Basic Math used in Electronic Service & Decibels",
      "order": 17,
      "dashboard": true
    },
    "sourceContents": [],
    "id": "C3-CURATED-SUMMARY",
    "generated": true,
    "subtrack": "generated",
    "title": "Chapter 3 summary · The ideas to keep",
    "description": "A short recap of the covered chapter, followed by a quiz on its most important relationships and common mistakes.",
    "module": "Associate CET Study Guide",
    "sourcePages": "16, 17, 18, 19, 20, 21, 22, 23, 24",
    "sourceAttribution": "Associate CET Study Guide · pp. 16 - 24",
    "teachingSections": [
      {
        "heading": "Key takeaways",
        "source_ids": [
          "S1",
          "S2",
          "S3",
          "S18",
          "S4",
          "S5",
          "S9",
          "S6",
          "S7",
          "S8",
          "S10",
          "S12",
          "S11",
          "S13",
          "S15",
          "S14",
          "S16",
          "S17"
        ]
      }
    ],
    "objectives": [
      "Recall the chapter’s key relationships",
      "Distinguish the assumptions and avoid common calculation errors"
    ],
    "html": "<h3>Key takeaways</h3><ul class=\"chapter-takeaways\"><li>Read prefixes before calculating: milli = 10⁻³, micro = 10⁻⁶ and pico = 10⁻¹². For example, 1,000 pF = 0.001 µF.</li><li>Rearrange an equality by applying the same inverse operation to both sides. Check the result in the original equation.</li><li>Keep the quantity symbol separate from its unit: resistance, reactance and impedance use Ω; frequency uses Hz, capacitance F and inductance H.</li><li>Choose the relationship that fits the known values: I = V/R and P = VI = I²R = V²/R. At fixed R, doubling V doubles I and quadruples P.</li><li>Resistors add in series; in parallel their reciprocals add. With positive branch resistances, the parallel equivalent is below either branch.</li><li>Internal resistance causes source voltage sag under load: I = EMF/(Rload + r), and terminal voltage = EMF − Ir.</li><li>For an ideal sine wave, peak-to-peak = 2 × peak and RMS = peak/√2. Do not apply the sine-wave RMS conversion to every waveform.</li><li>Period and frequency are reciprocals: T = 1/f. Higher frequency means a shorter cycle, not a larger amplitude.</li><li>Capacitor charge and energy are different: Q = CV and E = ½CV². At fixed C, doubling V doubles charge but quadruples energy.</li><li>Capacitors add in parallel and use reciprocal sums in series—the opposite combination rule to resistors.</li><li>The RC time constant is τ = RC. Ideal charging reaches about 63.2% after one τ; the final value is approached rather than reached exactly.</li><li>Capacitive reactance is X_C = 1/(2πfC): increasing f or C lowers it. In the ideal capacitor, current leads voltage.</li><li>Simple inductor combination rules require negligible mutual coupling: series adds; parallel uses reciprocal sums.</li><li>Inductive reactance is X_L = 2πfL: increasing f or L raises it. The accepted source describes voltage leading current.</li><li>For the ideal series RLC model, |Z| = √(R² + (X_L − X_C)²). Preserve the signed difference when identifying inductive or capacitive predominance.</li><li>Ideal resonance occurs when X_L = X_C, with f_r = 1/(2π√(LC)). Convert prefixes first and check the result using both reactances.</li></ul><p class=\"muted sm\">Source: Associate CET Study Guide · pp. 16 - 24 · Evidence S1 (Printed p. 16, scan 1/9, left column &#39;Powers of Ten&#39; and right-column Table 1.); S2 (Printed p. 16, scan 1/9, right-column conversion examples; printed p. 17, scan 2/9, upper left column.); S3 (Printed p. 17, scan 2/9, &#39;Equations&#39; at lower left, continuing at upper right.); S18 (Printed p. 24, scan 9/9, lower-left &#39;Units for Electronics Formulas&#39; table and right-column &#39;Greek Symbols&#39; table.); S4 (Printed p. 17, scan 2/9, right column &#39;Ohm’s Law&#39;, equations and Fig. 1.); S5 (Printed p. 18, scan 3/9, left column, continuation of &#39;Watt’s Law&#39;, Figs. 2–3.); S9 (Printed p. 19, scan 4/9, lower left column &#39;Resistors in Series and Parallel&#39;.); S6 (Printed p. 18, scan 3/9, right column &#39;Internal Resistance&#39;, Fig. 4 and text beneath; printed p. 19, scan 4/9, upper-left worked example.); S7 (Printed p. 19, scan 4/9, right column &#39;The Sine Wave&#39;, Fig. 5 and &#39;Amplitude Conversion&#39;.); S8 (Printed p. 19, scan 4/9, right column &#39;Time and Frequency Conversion&#39;.); S10 (Printed p. 20, scan 5/9, left column &#39;Capacitance&#39;, charge example and energy definition at bottom.); S12 (Printed p. 20, scan 5/9, right column &#39;Capacitors in Series&#39;; printed p. 21, scan 6/9, upper-left example.); S11 (Printed p. 21, scan 6/9, left column &#39;Time Constants&#39; and bottom example; upper-right continuation example.); S13 (Printed p. 21, scan 6/9, right column &#39;Capacitive Reactance&#39;, formula, explanatory text and Fig. 7A–C.); S15 (Printed p. 22, scan 7/9, left column &#39;Inductors in Series&#39; and &#39;Inductors in Parallel&#39;, bottom-left solution and upper-right solution.); S14 (Printed p. 22, scan 7/9, left-column &#39;Inductance&#39;; right-column &#39;Inductive Reactance&#39; and Fig. 9A–C.); S16 (Printed p. 23, scan 8/9, left column &#39;Impedance&#39;, Fig. 11 and solution; upper-right phasor sketches.); S17 (Printed p. 23, scan 8/9, right column &#39;Resonance&#39; and example; printed p. 24, scan 9/9, upper-left solution.)</p>",
    "experiment": "generated",
    "activities": [],
    "questions": [
      {
        "id": "C3-CURATED-SUMMARY-Q01",
        "type": "choice",
        "prompt": "Which conversion keeps the capacitance unchanged?",
        "explain": "Pico and micro differ by six powers of ten; divide the pF number by one million.",
        "rubric": "Expected answer: 1,000 pF = 0.001 µF\nReasoning: Pico and micro differ by six powers of ten; divide the pF number by one million.",
        "safety": false,
        "source_ids": [
          "S1",
          "S2"
        ],
        "choices": [
          "1,000 pF = 0.001 µF",
          "1,000 pF = 1 µF",
          "1,000 pF = 1,000 µF",
          "1,000 pF = 0.1 µF"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-SUMMARY-Q02",
        "type": "choice",
        "prompt": "Which method reliably checks your rearranged equation?",
        "explain": "A valid solution reproduces the original relationship.",
        "rubric": "Expected answer: Substitute the result into the original equality\nReasoning: A valid solution reproduces the original relationship.",
        "safety": false,
        "source_ids": [
          "S3"
        ],
        "choices": [
          "Only check that it is positive",
          "Remove the unit before comparing",
          "Use a different formula without checking the original",
          "Substitute the result into the original equality"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-SUMMARY-Q03",
        "type": "choice",
        "prompt": "Which pair correctly distinguishes a quantity and its unit?",
        "explain": "Quantity symbols name the variable; unit symbols state the measurement scale.",
        "rubric": "Expected answer: Capacitance C, measured in farads F\nReasoning: Quantity symbols name the variable; unit symbols state the measurement scale.",
        "safety": false,
        "source_ids": [
          "S18",
          "S10"
        ],
        "choices": [
          "Frequency Ω, measured in resistance",
          "Inductance Hz, measured in hertz",
          "Capacitance C, measured in farads F",
          "Capacitance F, measured in coulombs C"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-SUMMARY-Q04",
        "type": "choice",
        "prompt": "At fixed resistance, voltage doubles. What happens to current and power?",
        "explain": "I = V/R is linear in V; P = V²/R contains its square.",
        "rubric": "Expected answer: Current doubles; power quadruples\nReasoning: I = V/R is linear in V; P = V²/R contains its square.",
        "safety": false,
        "source_ids": [
          "S4",
          "S5"
        ],
        "choices": [
          "Current halves; power doubles",
          "Current doubles; power quadruples",
          "Both double",
          "Both quadruple"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-SUMMARY-Q05",
        "type": "choice",
        "prompt": "Two positive resistors are connected in parallel. Their equivalent resistance is…",
        "explain": "Reciprocal addition increases conductance and lowers equivalent resistance.",
        "rubric": "Expected answer: Lower than either branch resistance\nReasoning: Reciprocal addition increases conductance and lowers equivalent resistance.",
        "safety": false,
        "source_ids": [
          "S9"
        ],
        "choices": [
          "Lower than either branch resistance",
          "The sum of the branch values",
          "Always greater than both branches",
          "Negative"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-SUMMARY-Q06",
        "type": "choice",
        "prompt": "Why can a loaded battery have terminal voltage below its EMF?",
        "explain": "The series internal resistance drops Ir while current flows.",
        "rubric": "Expected answer: Load current creates a voltage drop across internal resistance\nReasoning: The series internal resistance drops Ir while current flows.",
        "safety": false,
        "source_ids": [
          "S6"
        ],
        "choices": [
          "Every load permanently changes the unit volt",
          "EMF must be divided by capacitance",
          "Terminal voltage always equals EMF",
          "Load current creates a voltage drop across internal resistance"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-SUMMARY-Q07",
        "type": "choice",
        "prompt": "Which amplitude conversion requires the ideal sine-wave assumption?",
        "explain": "The 1/√2 factor is specific to the ideal sinusoidal waveform used here.",
        "rubric": "Expected answer: RMS = peak/√2\nReasoning: The 1/√2 factor is specific to the ideal sinusoidal waveform used here.",
        "safety": false,
        "source_ids": [
          "S7"
        ],
        "choices": [
          "Charge = capacitance × voltage",
          "Series resistance is the sum",
          "RMS = peak/√2",
          "Frequency = 1/period"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-SUMMARY-Q08",
        "type": "choice",
        "prompt": "Frequency doubles. What happens to period?",
        "explain": "T = 1/f: doubling the denominator halves the period.",
        "rubric": "Expected answer: It halves\nReasoning: T = 1/f: doubling the denominator halves the period.",
        "safety": false,
        "source_ids": [
          "S8"
        ],
        "choices": [
          "It stays fixed",
          "It halves",
          "It doubles",
          "It quadruples"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-SUMMARY-Q09",
        "type": "choice",
        "prompt": "At fixed capacitance, voltage doubles. What happens to charge and stored energy?",
        "explain": "Q = CV is linear in V; E = ½CV² contains its square.",
        "rubric": "Expected answer: Charge doubles; energy quadruples\nReasoning: Q = CV is linear in V; E = ½CV² contains its square.",
        "safety": false,
        "source_ids": [
          "S10"
        ],
        "choices": [
          "Charge doubles; energy quadruples",
          "Both double",
          "Charge quadruples; energy doubles",
          "Both stay fixed"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-SUMMARY-Q10",
        "type": "choice",
        "prompt": "Which ideal capacitor combination rule is correct?",
        "explain": "The capacitor rules reverse the familiar resistor arrangements.",
        "rubric": "Expected answer: Parallel capacitances add; series uses reciprocal sums\nReasoning: The capacitor rules reverse the familiar resistor arrangements.",
        "safety": false,
        "source_ids": [
          "S12"
        ],
        "choices": [
          "Series capacitances add; parallel uses reciprocal sums",
          "Both arrangements add directly",
          "Both arrangements equal the smallest capacitor exactly",
          "Parallel capacitances add; series uses reciprocal sums"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-SUMMARY-Q11",
        "type": "choice",
        "prompt": "After one RC time constant, an ideal charging capacitor has reached approximately…",
        "explain": "One time constant identifies a characteristic charging timescale; it is not exact completion.",
        "rubric": "Expected answer: 63.2% of its final voltage\nReasoning: One time constant identifies a characteristic charging timescale; it is not exact completion.",
        "safety": false,
        "source_ids": [
          "S11"
        ],
        "choices": [
          "36.8% for the charging curve",
          "0% for every charging circuit",
          "63.2% of its final voltage",
          "100% exactly"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-SUMMARY-Q12",
        "type": "choice",
        "prompt": "At fixed capacitance, increasing frequency makes capacitive reactance…",
        "explain": "Frequency is in the denominator of X_C = 1/(2πfC).",
        "rubric": "Expected answer: Smaller\nReasoning: Frequency is in the denominator of X_C = 1/(2πfC).",
        "safety": false,
        "source_ids": [
          "S13"
        ],
        "choices": [
          "Equal to resistance in every circuit",
          "Smaller",
          "Larger",
          "Unchanged"
        ],
        "correct": 1
      },
      {
        "id": "C3-CURATED-SUMMARY-Q13",
        "type": "choice",
        "prompt": "When is simple arithmetic for ideal inductor combinations appropriate?",
        "explain": "Mutual coupling changes the model; the simple rules are explicitly limited here.",
        "rubric": "Expected answer: When mutual magnetic coupling is negligible\nReasoning: Mutual coupling changes the model; the simple rules are explicitly limited here.",
        "safety": false,
        "source_ids": [
          "S15"
        ],
        "choices": [
          "When mutual magnetic coupling is negligible",
          "For every magnetically coupled arrangement",
          "Only when inductance is measured in farads",
          "When voltage is zero regardless of magnetic coupling"
        ],
        "correct": 0
      },
      {
        "id": "C3-CURATED-SUMMARY-Q14",
        "type": "choice",
        "prompt": "At fixed inductance, doubling frequency makes inductive reactance…",
        "explain": "X_L = 2πfL contains frequency as a direct factor, unlike capacitive reactance.",
        "rubric": "Expected answer: Twice as large\nReasoning: X_L = 2πfL contains frequency as a direct factor, unlike capacitive reactance.",
        "safety": false,
        "source_ids": [
          "S14"
        ],
        "choices": [
          "Half as large",
          "Four times as large",
          "Unchanged",
          "Twice as large"
        ],
        "correct": 3
      },
      {
        "id": "C3-CURATED-SUMMARY-Q15",
        "type": "choice",
        "prompt": "A series circuit has R = 3 Ω, X_L = 16 Ω and X_C = 20 Ω. Which answer is correct?",
        "explain": "X_L − X_C = −4 Ω; √(3² + (−4)²) = 5 Ω. A magnitude is nonnegative.",
        "rubric": "Expected answer: |Z| = 5 Ω; predominantly capacitive\nReasoning: X_L − X_C = −4 Ω; √(3² + (−4)²) = 5 Ω. A magnitude is nonnegative.",
        "safety": false,
        "source_ids": [
          "S16"
        ],
        "choices": [
          "|Z| = −5 Ω; predominantly capacitive",
          "|Z| = 4 Ω; purely resistive",
          "|Z| = 5 Ω; predominantly capacitive",
          "|Z| = 39 Ω; predominantly inductive"
        ],
        "correct": 2
      },
      {
        "id": "C3-CURATED-SUMMARY-Q16",
        "type": "choice",
        "prompt": "At fixed L, quadrupling C changes ideal resonant frequency to…",
        "explain": "The factor of four becomes a factor of two under √(LC), which is in the denominator.",
        "rubric": "Expected answer: Half its previous value\nReasoning: The factor of four becomes a factor of two under √(LC), which is in the denominator.",
        "safety": false,
        "source_ids": [
          "S17"
        ],
        "choices": [
          "The same frequency",
          "Half its previous value",
          "One quarter",
          "Twice its previous value"
        ],
        "correct": 1
      }
    ],
    "minutes": 10,
    "simulator": null,
    "kind": "summary",
    "ordering": "independent",
    "sourceUnitId": "C3-CURATED-SUMMARY",
    "scanId": "75f4c1db-1d8c-40df-890b-4211862bcfc4",
    "archived": false,
    "curatedSeries": true,
    "seriesId": "C3-CURATED-20261013",
    "seriesOrder": 17,
    "overview": null,
    "sourceTrack": "guide",
    "libraryView": "ceta"
  }
];
