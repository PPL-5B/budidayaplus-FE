'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogClose, DialogFooter, DialogTrigger } from '@/components/ui/dialog';

interface FishDeathReports extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string
  cycleId?: string
  numfishdeaths: Number
}